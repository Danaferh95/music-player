/*

Este componente gestionara la carga de la cancion, el play, pause, next, previous, loop y shuffle

A continuación explicaremos más a detalle como funciona cada sección


*/


import { useState, useEffect } from 'react'

//Este es el componente de la barra de progreso

import { Progress } from "./Progress";

//Iconos
import loopCurrentBtn from "../assets/loop-active.png";
import loopNoneBtn from "../assets/loop-inactive.png";
import playBtn from "../assets/play.png";
import pauseBtn from "../assets/pause.png";
import nextPrevBtn from "../assets/next-previous.png";
import shuffleAllBtn from "../assets/suffle-active.png";
import shuffleNoneBtn from "../assets/suffle-inactive.png";


//Empezamos creando el componente que recibe el array de las tracks, la variable de true del autoPLayeNextTrack, el curTrack q es la track actual que se
//esta en play, y el setCurTrack para actualizarala cuando sea necesario 

function MusicPlayer({tracks, autoPlayNextTrack, curTrack, setTheCurTrack}) {


  //aqui asignamos la variable de nuestra cancion
  const [audio, setAudio] = useState(null);
  //variable para identificar si esta sonando la cancion o no
  const [isPlaying, setIsPlaying] = useState(false);
  // variable para identificar si la cancion ya termino
  const [hasEnded, setHasEnded] = useState(false);
  //el titulo de nuestra cancion que aparecera en el reproductor
  const [title, setTitle] = useState("");
  //variable que seteara el largo de la cancion
  const [length, setLength] = useState(0);
  //variable que setea el tiempo que dura la cancion
  const [time, setTime] = useState(0);
  //el Slider de nuestro Progress 
  const [slider, setSlider] = useState(1);
  //variable que almacena el buffer de la cancion(es decir la data que se encuentra cargada)
  const [buffer, setBuffer] = useState(0);
  //variable con nuestro drag 
  const [drag, setDrag] = useState(0);
 //varibale para activar o no el shuffle
  const [shuffled, setShuffled] = useState(false);
  //variable para activar o no el loop
  const [looped, setLooped] = useState(false);


  //nuestra variable playlist que almacenará el array de tracks que recibimos del Home.jsx
  let playlist = tracks;

  //Funcion para convertir los segundos en un formato legible de horas, minutos y segundos. Recibe "seconds", que son los segundos
  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    const formattedHours = hours > 0 ? hours.toString() + ":" : "";
    const formattedMinutes =
      minutes < 10 && hours > 0
        ? "0" + minutes.toString() + ":"
        : minutes.toString() + ":";
    const formattedSeconds =
      remainingSeconds < 10
        ? "0" + remainingSeconds.toString()
        : remainingSeconds.toString();
    //Combina las horas, minutos y segundos formateados en una sola cadena y la devuelve. Por ejemplo, formatTime(3665) devolverá "1:01:05".
    return formattedHours + formattedMinutes + formattedSeconds;
  };


    //Aqui cargamos el audio
    useEffect(() => {
      // Aquí se crea un nuevo objeto de audio utilizando la URL del array de objetos que le pasamos desde el componente HOME.
      const audio = new Audio(playlist[curTrack].url);
      
      // Cargamos el archivo de audio.
      audio.load();
    
      // Esta función se llama cuando los datos del audio están listos. 
      // Establecemos la duración del audio y el tiempo actual (que por defecto es 0).
      const setAudioData = () => {
        // Verificamos si los datos del audio están listos (readyState >= 2).
        if (audio.readyState >= 2) {
          // Establecemos la duración del audio.
          setLength(audio.duration);
          // Establecemos el tiempo actual del audio.
          setTime(audio.currentTime);
        }
      };
    
      // Esta función se llama para actualizar el tiempo actual del audio y la posición del slider.
      const setAudioTime = () => {
        // Obtenemos el tiempo actual del audio.
        const curTime = audio.currentTime;
        // Establecemos el tiempo actual del audio.
        setTime(curTime);
        // Calculamos la posición del slider como un porcentaje del tiempo total del audio.
        setSlider(curTime ? ((curTime * 100) / audio.duration).toFixed(1) : 0);
      };
    
      // Esta función se llama para actualizar el progreso del buffer del audio.
      const setAudioProgress = () => {
        // Verificamos si hay al menos un rango de buffer.
        if (audio.buffered.length > 0) {
          // Calculamos el porcentaje de buffer cargado y lo establecemos.
          const bufferedPercentage = (audio.buffered.end(0) / audio.duration) * 100;
          setBuffer(bufferedPercentage.toFixed(2));
        }
      };
    
      // Esta función se llama cuando el audio ha terminado de reproducirse.
      const setAudioEnd = () => setHasEnded(!hasEnded);
    
      // Agregamos los listeners para manejar los eventos del audio.
      audio.addEventListener("loadeddata", setAudioData);
      audio.addEventListener("timeupdate", setAudioTime);
      audio.addEventListener("progress", setAudioProgress);
      audio.addEventListener("ended", setAudioEnd);
    
      // Guardamos el objeto de audio en nuestra variable de estado.
      setAudio(audio);
      // Establecemos el título de la canción actual utilizando el índice del track actual en la playlist.
      setTitle(playlist[curTrack].title);
    
      // Esta función de limpieza se ejecuta cuando el componente se desmonta o se actualiza.
      return () => {
        // Quitamos los listeners del audio para evitar fugas de memoria.
        audio.removeEventListener("loadeddata", setAudioData);
        audio.removeEventListener("timeupdate", setAudioTime);
        audio.removeEventListener("progress", setAudioProgress);
        audio.removeEventListener("ended", setAudioEnd);
        // Pausamos el audio y limpiamos su fuente.
        audio.pause();
        audio.src = "";
      };
    }, []); // Este efecto se ejecuta solo una vez, cuando el componente se crea.
    



 // Este useEffect se ejecuta cuando actualizamos nuestro track actual a uno nuevo
  useEffect(() => {
    if (audio) {
      // Cambiamos la fuente del audio al URL del track actual
      audio.src = playlist[curTrack].url;
      // Cargamos el nuevo archivo de audio
      audio.load();

      // Cuando el audio esté listo para reproducirse
      audio.oncanplay = () => {
        // Actualizamos el título de la canción
        setTitle(playlist[curTrack].title);
        // Iniciamos la reproducción del audio
        play();
      };

      // Función para manejar el evento de finalización del audio
      const setAudioEnd = () => {
        setHasEnded(!hasEnded);
      };
      // Agregamos el listener para el evento 'ended'
      audio.addEventListener("ended", setAudioEnd);

      // Función para quitar los listenes cuando cambia el track
      return () => {
        // Quitamos el listener del evento 'ended'
        audio.removeEventListener("ended", setAudioEnd);
      };
    }
  }, [curTrack]); // Este efecto se ejecuta cada vez que cambia el 'curTrack'


  // Este useEffect se ejecuta para actualizar la barra de progreso al hacer drag
  useEffect(() => {
    if (audio) {
      // Pausamos el audio
      pause();
      // Calculamos el nuevo tiempo del audio basado en la posición del slider
      const val = Math.round((drag * audio.duration) / 100);
      // Obtenemos los rangos de buffer del audio
      const bufferedRanges = audio.buffered;

      // Verificamos si el nuevo tiempo está dentro de los rangos de buffer
      let isInBufferedRange = false;
      for (let i = 0; i < bufferedRanges.length; i++) {
        if (val >= bufferedRanges.start(i) && val <= bufferedRanges.end(i)) {
          isInBufferedRange = true;
          break;
        }
      }

      // Si el nuevo tiempo está en el rango de buffer, actualizamos el tiempo actual del audio
      if (isInBufferedRange) {
        audio.currentTime = val;
      } else {
        // Si no, agregamos un listener para esperar a que el buffer esté listo
        const waitingHandler = () => {
          if (audio.readyState === 4) {
            // Quitamos el listener una vez que el buffer está listo
            audio.removeEventListener("waiting", waitingHandler);
            // console.log("waiting for data");
          }
        };
        audio.addEventListener("waiting", waitingHandler);
      }
    }
  }, [drag]); // Este efecto se ejecuta cada vez que cambia el 'drag'


 
//Este useEffect se dispara cuando cambia el estado de hasEnded, donde si esque se encuentra 
  useEffect(() => {
    if (hasEnded) {
      if (looped) {
        audio.currentTime = 0;
        play();
      } else if (autoPlayNextTrack) {
        next();
      } else {
        setIsPlaying(false);
      }
      setHasEnded(false); // Reset hasEnded state
    }
  }, [hasEnded]);


  // Seteamos el estado de loop a true o false si esque se activa o no con el boton
  const loop = () => {
    setLooped(!looped);
  };

// Seteamos el estado de shuffle a true o false si esque se activa o no con el boton
  const shuffle = () => {
    setShuffled(!shuffled);
  };

  //funcion para dar play al siguiente elemento dentro del array de playlist. 
  const next = () => {
    //curTrack nos sirve como el indice
    const index = curTrack;

    //vemos si shuffle esta activo, si es asi hacemos un random y el setTheCurTrack ahora es un numero al azar
    if (shuffled) {
      const randomTrackIndex = Math.floor(Math.random() * playlist.length);
      setTheCurTrack(randomTrackIndex);
    } else {
      //sino entonces como es un next verificamos si es menor al length del playlist y sumamos 1, sino regresa al inicio
      index < playlist.length - 1
        ? setTheCurTrack((curTrack + 1))
        : setTheCurTrack(0);
    }
  };

 //funcion para dar play al elemento previo dentro del array de playlist. 
  const previous = () => {
    //curTrack nos sirve como el indice
    const index = curTrack;
     //vemos si shuffle esta activo, si es asi hacemos un random y el setTheCurTrack ahora es un numero al azar
    if (shuffled) {
      const randomTrackIndex = Math.floor(Math.random() * playlist.length);
      setTheCurTrack(randomTrackIndex);
    }else {
      //sino entonces como es un prev verificamos si es mayor a 0 y restamos 1, sino nos vamos a la ultima cancion del playlist
      index > 0
        ? setTheCurTrack((curTrack-1))
        : setTheCurTrack((playlist.length - 1));
    }
  };

  //funcion para dar play setear a que el estado de play es verdadero
  const play = () => {
    setIsPlaying(true);
    audio.play();
  };
 //funcion para dar pause setear a que el estado de play es falso
  const pause = () => {
    setIsPlaying(false);
    audio.pause();
  };

  //gestiona la actualización del slide cuando se hace drag
  const handleSliderChange = (e) => {
    setSlider(e.target.value);
    setDrag(e.target.value);
  };

//creamos el HTML dinamico
//donde tenemos nuestro componente de progreso, aqui le vamos a pasar los valores del slide, bufffer, setSlide, setDrag, 
//en nuestro button-box tenemos los botones para realizar el seteo del loop, previous, pause, play, next, y shuffle
  return (
    
    <>
       <div>
        <div>
         <h2>{title}</h2>
         <h3>
          {
          
            `${!time ? "0:00" : formatTime(time)}/${
              !length ? "0:00" : formatTime(length)
              }`
          }
          </h3>
        </div>
        <Progress
          value={slider}
          progress={buffer}
          onChange={handleSliderChange}
          onMouseUp={play}
          onTouchEnd={play}
        />
         <div className ="button-box">
          <button onClick={loop}> <img src={looped ? loopCurrentBtn : loopNoneBtn} alt="" /> </button>
          <button onClick={previous}><img src={nextPrevBtn} alt="" /> </button>
          {isPlaying ? (
            <button onClick={pause}> <img src={pauseBtn} alt="" /></button>
          ) : (
            <button onClick={play}> <img src={playBtn}alt="" /></button>
          )}
          <button onClick={next}> <img src={nextPrevBtn} alt="" /> </button>
          <button onClick={shuffle}> <img src={shuffled ? shuffleAllBtn : shuffleNoneBtn} alt="" /> </button>
        </div>
         

      </div>
    </>
  )
}

export default MusicPlayer
