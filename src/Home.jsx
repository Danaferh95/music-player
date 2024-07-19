/*
Este va a ser nuestro fichero principal donde vamos a cargar los componentes del MusicPlayer, el SongContainer, userFoto (que por ahora es una generica para todos los usuarios)
el UseNavigate para gestionar el logOut
y CodeEffect que es codigo creativo para implementarlo en el background
*/

import { useState, useEffect } from 'react';
import MusicPlayer from './components/MusicPlayer';
import SongContainer from './components/SongContainer';
import userFoto from "./assets/profile.png";
import { useNavigate } from 'react-router-dom'
import CodeEffect from './components/CodeEffect';

//Creamos nuestro componente de HOME que recibe el id_user para saber que información cargar

function Home({id_user}) {

    //Declaramos las tracks que sera un array que pasamos al MusicPlayer
    const [tracks, setTracks] = useState([]);
    //Declaramos el curTrack para pasarlo al MusicPlayer y a nuestro SongContainer, asi podemos gestionar desde ambos hijos cual es el track a dar play
    const [curTrack, setCurTrack] = useState(0);
    //Esta variable sera para gestionar cuando se carga la cancion, que muestre el mensaje de si se encuentra cargando la cancion
    const [isLoading, setIsLoading] = useState(false);
 
    //userId que es el user ID, se utilizo el setUserID para hacer las pruebas sin una base de datos anteriormente, en este ya usamos el useState con el id_user
    //que recibimos del Home
    const [userId, setUserID] = useState(id_user);

    //activeUser como variable para verificar cual es el activeUser
    const [activeUser, setActiveUser] = useState(null);

    //Para gestionar el LogOut
    let navigate = useNavigate()

    //Este use Effect lo vamos a usar para identificar el usuario que se encuentra loggado

    useEffect(() =>{
        //hacemos el fetch al back end con el ID
        fetch(`https://music-player-backend-oawm.onrender.com/user/${userId}`)
        .then(respuesta => respuesta.json())
        .then( respuesta => {
            if(respuesta.error){
                console.log("no user logged in");
            }
            
            //si no hay error seteamos el ususario activo que se loggeo con su información
            setActiveUser(respuesta);

        })
        .catch( error => console.error("No existe usuario", error));

    }, [])


    //Este use Effect lo vamos a usar para cargar las canciones

    useEffect(() =>{
        //Hacemos la petición de las tracks con el userID
        fetch(`https://music-player-backend-oawm.onrender.com/tracks/${userId}`)
        .then(respuesta => respuesta.json())
        .then( respuesta => {
        if(respuesta.error){
                console.log("no user logged in, can't get tracks");
        }
        //seteamos las tracks que obtenemos como respuesta del backend
        setTracks(respuesta);
        })
        .catch(error => console.error('No tracks found', error)); //retornamos error si no logra conectarse el back
    }, []) 

    //Esta funcion se utiliza para cargar los archivos en el googledrive

    async function handleFileUpload(event) {
        event.preventDefault();
        console.log("loading song..");
        //aqui cambiamos el estado del loading a true porque ahora vamos a hacer el proceso de esperar la carga de la cancion
        setIsLoading(true);

        //formData representa el archivo que estamos cargando
        const formData = new FormData(event.currentTarget);

        //Le vamos a mandar el id del usuario y su user name para que pueda crear la carpeta, o identificarla si es necesario
        formData.append("id_user", activeUser.id_user);
        formData.append("user_name", activeUser.user_name);

        //Aqui hacemos el fetch para hacer el upload a la carpeta que necesitamos, le mandamos en el body toda la información del archivo el id_user y user_name 

        await fetch('https://music-player-backend-oawm.onrender.com/upload', {
            method: 'POST',
            body: formData,
        })
        .then(respuesta => respuesta.json())
        .then(data => {

            //Si todo sale bien se agrega al estado de las tracks la nueva cancion con su url 
            console.log('returning:', data);
            //setIsLoading false porque ya cargo
            setIsLoading(false);
            //creamos el objeto newTrack con toda la data del archivo cargado
            const newTrack = {
                id_track: data.trackData, //aqui retorna el ID creado
                url: data.url, //aqui va el url del servidor cuando cargue en render
                title: data.title, //titulo
                artist: data.artist, //artista
                id_user: data.id_user //data del user activo
                
            };

            //agregamos a nuestro array de tracks la nueva track para que se refleje en el Home
            setTracks([...tracks, newTrack]);
            //console.log(tracks);
        })
        .catch(error => console.error('Error uploading file:', error)); //retornamos error si no logra conectarse el back
    };



    //funcion para asignar cual es el current track que se va a dar play ese rato
    function setTheCurTrack(newTrack) {
        setCurTrack(newTrack);
    }

    //on play para darle play a la curtrack
    function onPlay(index) {
        setTheCurTrack(index);
    }

    //funcion para editar la cancion, recibe id_track, title, artist

    async function onEdit(id_track, title, artist) {

        //Aqui cambiamos la información del track en el front

        let trackToChange = tracks.find( track => track.id_track === id_track);
        trackToChange.title = title;
        trackToChange.artist = artist;
        
        let updatedTracks = tracks.map(tracks => tracks);
        setTracks(updatedTracks);

        // Aqui hacemos el request para actualizar el track en el backend pasandole el ID en la URL y en el body mandamos el title y artist a actualizar

        await fetch(`https://music-player-backend-oawm.onrender.com/updateTrack/${id_track}`, {

            method: 'PUT',
            body: JSON.stringify({ title: title, artist: artist }),
            headers: {
            'Content-Type': 'application/json'
            }
            
        })
        .then(respuesta => console.log('Track updated successfully:', respuesta)) 
        .catch(error => console.error('Error updating track:', error)); //retornamos error si no logra conectarse el back
        
    }


    //funcion para eliminar el track

    async function onDelete(id_track) {

        //Aquí hacemos el request para eleminiar el track pasandole el ID en la URL

        await fetch(`https://music-player-backend-oawm.onrender.com/delete-file/${id_track}`, {
            method: 'DELETE'
        })
        .then(respuesta => {
            if (respuesta.ok) {
                //si todo sale OK entonces identificamos que track se borro y hacemos un filter en el setTrack para actualizar nuestro Front
                setTracks(tracks.filter(track => track.id_track !== id_track));
                console.log('Track deleted successfully');
            } else {
                //sino retornamos error
                console.error('Failed to delete track');
            }
        })
        .catch(error => {
            //retornamos error si no logra conectarse el back
            console.error('Error deleting track:', error);
        });

    }

    //Funcion de logOUt para terminar la session del ususario en el back y la navegación a la pantalla de logIN

    async function logOut() {
        //Aqui se hace el llamado al back
        await fetch("https://music-player-backend-oawm.onrender.com/logout", {
            method: "GET"
        })
        .then(respuesta => respuesta.json())
        .then(respuesta => {
            //Si todo sale bien hacemos el logout
            console.log(respuesta);
            if (respuesta.message === 'Logged out successfully') {
                navigate("/login"); //Redirijimos
            } else {
                //sino retornamos error
                console.error('Failed to log out');
            }
        })
        .catch(error => {
            //retornamos error si no logra conectarse el back
            console.error('Error logging out:', error);
        });
    }
    //Retornamos el HTML interactivo donde seteamos el nombre del ususario
    //la player-section donde cargaremos nuestro componente del MusicPlayer, a este componente se le pasa los tracks, si se da autoPlay, el curTrack, y la funcion de setTheCurTrack
    //que podremos ver su funcion dentro del componente
    //creative-code-space CodeEffect donde ira el código creativo
    //Luego la sección donde esta nuestro form para manejar la carga del archivo, con el handleFileUpload y el tipo de archivo que se cargara. También podemos
    //ver que que se cambia el componente segun el estado de isLoading para mostrar el mensaje de carga o el form cuando la cancion cargue
    // Tenemos en la ultima seccion el componente de SongContainer, donde se cargara la lista de nuestro tracks agregados
    //se hace un map del tracks.length para crear el SongContainer con todos los datos que le pasamos del id_track, title, artist, onPlay, onEdit,onDelete

    return (
        <>
            <header>
                <div>
                    <div>
                        <span>{ activeUser ? activeUser.user_name : "usuario"}</span>
                        <button onClick={() => logOut()}>Logout</button>
                    </div>
                    <img src={userFoto} alt="User" />
                </div>
            </header>
            <div className="player-section">
                {tracks.length >  0 ? (
                <MusicPlayer tracks={tracks} autoPlayNextTrack={true} curTrack={curTrack} setTheCurTrack={setTheCurTrack} />
                ) : ( <p> Looking for tracks...</p> ) }
                <div className="creative-code-space">
                <CodeEffect />
                </div>
            </div>
            { !isLoading ? <form className = "upload-song-form" onSubmit={handleFileUpload} encType="multipart/form-data">
                    <input type="file" name="mp3file" accept=".mp3" />
                    <input type="submit" value="Add tracks" />
                </form> : <p>Song is loading...please wait</p>}
            <section>
              
                
                <div>
                    {tracks.length > 0 ? tracks.map(({ id_track, title, artist }, index) =>
                        <SongContainer key={id_track} id_track={id_track} title={title} artist={artist} onPlay={()=> onPlay(index)} onEdit = {onEdit} onDelete={onDelete} />
                    ) : <p>¡Add some songs!</p>}
                </div>
            </section>
        </>
    );
}

export default Home;
