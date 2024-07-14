import { useState, useEffect } from 'react';
import MusicPlayer from './MusicPlayer';
import SongContainer from './SongContainer';
import userFoto from "./assets/profile.png";
import { useNavigate } from 'react-router-dom'
import CodeEffect from './CodeEffect';

function Home({id_user}) {
    const [tracks, setTracks] = useState([]);
    const [curTrack, setCurTrack] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
 

    const [userId, setUserID] = useState(id_user);
    const [activeUser, setActiveUser] = useState(null);

    let navigate = useNavigate()

//Este use Effect lo vamos a usar para identificar el usuario que se encuentra loggado

    useEffect(() =>{
        fetch(`https://music-player-backend-oawm.onrender.com/user/${userId}`)
        .then(respuesta => respuesta.json())
        .then( respuesta => {
            if(respuesta.error){
                console.log("no user logged in");
            }
            
            setActiveUser(respuesta);

        })
        .catch( error => console.error("No existe usuario", error));

    }, [])


    //Este use Effect lo vamos a usar para cargar las canciones

    useEffect(() =>{
        fetch(`https://music-player-backend-oawm.onrender.com/tracks/${userId}`)
        .then(respuesta => respuesta.json())
        .then( respuesta => {
        if(respuesta.error){
                console.log("no user logged in");
        }
        setTracks(respuesta);

        })
    }, []) 

//Esta funcion se utiliza para cargar los archivos en el googledrive
    async function handleFileUpload(event) {
        event.preventDefault();
        console.log("loading song..");
        setIsLoading(true);
        const formData = new FormData(event.currentTarget);

        //Le vamos a mandar el id del usuario y su user name para que pueda crear la carpeta, o identificarla si es necesario
        formData.append("id_user", activeUser.id_user);
        formData.append("user_name", activeUser.user_name);

        //Aqui hacemos el fetch para hacer el upload a la carpeta que necesitamos

        await fetch('https://music-player-backend-oawm.onrender.com/upload', {
            method: 'POST',
            body: formData,
        })
        .then(respuesta => respuesta.json())
        .then(data => {

            //Si todo sale bien se agrega al estado de las tracks la nueva cancion con su url 
            console.log('returning:', data);
            setIsLoading(false);
            const newTrack = {
                id_track: data.trackData, //aqui retorna el ID creado
                url: data.url, //aqui va el url del servidor cuando cargue en render
                title: data.title,
                artist: data.artist,
                id_user: data.id_user
                
            };
            setTracks([...tracks, newTrack]);
            //console.log(tracks);
        })
        .catch(error => console.error('Error uploading file:', error));
    };




    function setTheCurTrack(newTrack) {
        setCurTrack(newTrack);
    }

    function onPlay(index) {
        setTheCurTrack(index);
    }

    async function onEdit(id_track, title, artist) {

        //Aqui cambiamos la información del track en el front

        let trackToChange = tracks.find( track => track.id_track === id_track);
        trackToChange.title = title;
        trackToChange.artist = artist;
        
        let updatedTracks = tracks.map(tracks => tracks);
        setTracks(updatedTracks);

        // Aqui hacemos el request para actualizar el track
        await fetch(`https://music-player-backend-oawm.onrender.com/updateTrack/${id_track}`, {

            method: 'PUT',
            body: JSON.stringify({ title: title, artist: artist }),
            headers: {
            'Content-Type': 'application/json'
            }
            
        })
        .then(respuesta => console.log('Track updated successfully:', respuesta))
        .catch(error => console.error('Error updating track:', error));
        
    }

    async function onDelete(id_track) {

        await fetch(`https://music-player-backend-oawm.onrender.com/delete-file/${id_track}`, {
            method: 'DELETE'
        })
        .then(respuesta => {
            if (respuesta.ok) {
                setTracks(tracks.filter(track => track.id_track !== id_track));
                console.log('Track deleted successfully');
            } else {
                console.error('Failed to delete track');
            }
        })
        .catch(error => {
            console.error('Error deleting track:', error);
        });

    }

    async function logOut() {

        await fetch("https://music-player-backend-oawm.onrender.com/logout", {
            method: "GET"
        })
        .then(respuesta => respuesta.json())
        .then(respuesta => {
            console.log(respuesta);
            if (respuesta.message === 'Logged out successfully') {
                navigate("/login");
            } else {
                console.error('Failed to log out');
            }
        })
        .catch(error => {
            console.error('Error logging out:', error);
        });
    }

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
