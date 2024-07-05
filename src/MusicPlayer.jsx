import { useState, useEffect } from 'react'


import { Progress } from "./components/Progress";

//Iconos
import loopCurrentBtn from "./assets/loop-active.png";
import loopNoneBtn from "./assets/loop-inactive.png";
import playBtn from "./assets/play.png";
import pauseBtn from "./assets/pause.png";
import nextPrevBtn from "./assets/next-previous.png";
import shuffleAllBtn from "./assets/suffle-active.png";
import shuffleNoneBtn from "./assets/suffle-inactive.png";



function MusciPlayer({songs, autoPlayNextTrack=true, curTrack, setTheCurTrack}) {

  const [audio, setAudio] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasEnded, setHasEnded] = useState(false);
  const [title, setTitle] = useState("");
  const [length, setLength] = useState(0);
  const [time, setTime] = useState(0);
  const [slider, setSlider] = useState(1);
  const [buffer, setBuffer] = useState(0);
  const [drag, setDrag] = useState(0);
 
  const [shuffled, setShuffled] = useState(false);
  const [looped, setLooped] = useState(false);


  let trackList = songs;
 
  let playlist = trackList;
 
 

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
  
    return formattedHours + formattedMinutes + formattedSeconds;
  };


  //Aqui cargamos el audio
  useEffect(() => {

    //Aqui se crea un nuevo audio utilizando nuestro URL del array the objetos que le pasamos desde el HOME
    const audio = new Audio(trackList[curTrack].url);
    audio.load();

    //Entonces en setAudioData le decimos cuando dura el audio con la propiedad audio.duration, y seteamos el audio.currentTime que por default es 0
    const setAudioData = () => {
      setLength(audio.duration);
      setTime(audio.currentTime);
    };

    //Para hacer set del tiempo creamos el curTime que va a ser igual al audio.currentTime de ese momento. En setTime le pasamos curTime, para el setSlider indicamos
    //si ya existe curTime , entonces hacemos un calculo de en q posicion debería estar el slider de acuerdo a la duration, y sino empieza en 0.
    const setAudioTime = () => {
      const curTime = audio.currentTime;
      setTime(curTime);
      setSlider(curTime ? ((curTime * 100) / audio.duration).toFixed(1) : 0);
    };


    // Aqui vemos cuanto del audio se a cargado y hasta que momento se quedo, lo dividimos por el total que es el audio.duration y multiplicamos por 100 para que
    //nos retorn un valor en porcentaje, en setBuffer le decimos que tenga máximo 2 decimales.
    const setAudioProgress = () => {
      const bufferedPercentage = (audio.buffered.end(0) / audio.duration) * 100;
      setBuffer(bufferedPercentage.toFixed(2));
    };

 
    const setAudioEnd = () => setHasEnded(!hasEnded);
  
    audio.addEventListener("loadeddata", setAudioData);
    audio.addEventListener("timeupdate", setAudioTime);
    audio.addEventListener("progress", setAudioProgress);
    /*audio.addEventListener("volumechange", setAudioVolume);*/
    audio.addEventListener("ended", setAudioEnd);

    setAudio(audio);
    setTitle(trackList[curTrack].title);

    

    return () => {
      audio.removeEventListener("loadeddata", setAudioData);
      audio.removeEventListener("timeupdate", setAudioTime);
      audio.removeEventListener("progress", setAudioProgress);
      /*audio.removeEventListener("volumechange", setAudioVolume);*/
      audio.removeEventListener("ended", setAudioEnd);
      audio.pause();
      audio.src = "";
    };
  }, []);

  //Este use effect sirve cuando actualizamos nuestro current track a uno nuevo

  useEffect(() => {
    if (audio) {
      audio.src = trackList[curTrack].url;
      audio.load();

      audio.oncanplay = () => {
        setTitle(trackList[curTrack].title);
        play();
      };

      const setAudioEnd = () => {
        setHasEnded(!hasEnded);
      };
      audio.addEventListener("ended", setAudioEnd);

      return () => {
        audio.removeEventListener("ended", setAudioEnd);
      };
    }
  }, [curTrack]);


//Este useEffect sirve para actualizar la barra de progresso al hacer drag

  useEffect(() => {
    if (audio) {
      pause();
      const val = Math.round((drag * audio.duration) / 100);
      const bufferedRanges = audio.buffered;

      let isInBufferedRange = false;
      for (let i = 0; i < bufferedRanges.length; i++) {
        if (val >= bufferedRanges.start(i) && val <= bufferedRanges.end(i)) {
          isInBufferedRange = true;
          break;
        }
      }

      if (isInBufferedRange) {
        audio.currentTime = val;
      } else {
        const waitingHandler = () => {
          if (audio.readyState === 4) {
            audio.removeEventListener("waiting", waitingHandler);
            // console.log("waiting for data");
          }
        };
        audio.addEventListener("waiting", waitingHandler);
      }
    }
  }, [drag]);

  useEffect(() => {
    if (audio) {
      if (shuffled) {
        playlist = shufflePlaylist(playlist);
      }
      if (looped) {
        play();
      } else if (autoPlayNextTrack && !looped) {
        next();
      } else {
        setIsPlaying(false);
      }
    }
  }, [hasEnded]);

  useEffect(() => {
    if (audio) {
      let setAudioEnd;

      if (looped) {
        setAudioEnd = () => {
          audio.currentTime = 0;
          play();
        };
      } else {
        setAudioEnd = () => {
          setHasEnded(!hasEnded);
        };
      }

      audio.addEventListener("ended", setAudioEnd);

      return () => {
        audio.removeEventListener("ended", setAudioEnd);
      };
    }
  }, [looped]);


  const loop = () => {
    setLooped(!looped);
  };

  const shuffle = () => {
    setShuffled(!shuffled);
  };

  const shufflePlaylist = (arr) => {
    if (arr.length === 1) return arr;
    const rand = Math.floor(Math.random() * arr.length);
    return [arr[rand], ...shufflePlaylist(arr.filter((_, i) => i !== rand))];
  };

  const previous = () => {
    const index = curTrack;
    index !== 0
      ? setTheCurTrack((curTrack-1))
      : setTheCurTrack((curTrack));
  };

  const play = () => {
    setIsPlaying(true);
    audio.play();
  };

  const pause = () => {
    setIsPlaying(false);
    audio.pause();
  };

 

  const next = () => {
    const index = curTrack;
    index !== playlist.length - 1
      ? setTheCurTrack((curTrack + 1))
      : setTheCurTrack((curTrack));
  };



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
          onChange={(e) => {
            setSlider(e.target.value);
            setDrag(e.target.value);
            //console.log(drag);
          }}
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

export default MusciPlayer
