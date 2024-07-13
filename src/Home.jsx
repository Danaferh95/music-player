import { useState, useEffect } from 'react';
import MusicPlayer from './MusicPlayer';
import SongContainer from './SongContainer';
import userFoto from "../../music-player-backend/uploads/photos/profile.png";
import { useNavigate } from 'react-router-dom'

function Home({id_user}) {
    const [tracks, setTracks] = useState([
       
    ]);
    const [curTrack, setCurTrack] = useState(0);
    
    // user temporal

    const [userId, setUserID] = useState(id_user);
    const [activeUser, setActiveUser] = useState(null);

    let navigate = useNavigate()

//Este use Effect lo vamos a usar para identificar el usuario que se encuentra loggado
   useEffect(() =>{
        fetch(`http://localhost:4000/user/${userId}`)
        .then(respuesta => respuesta.json())
        .then( respuesta => {
           if(respuesta.error){
                //return navigate("/login");
                console.log("no user logged in");
           }
           console.log(respuesta);
           setActiveUser(respuesta);

        })
        .catch( error => console.error("No existe usuario", error));

    }, [])

 

   /*console.log(activeUser.id_user);
    console.log(activeUser.user_name);*/

//Este use Effect lo vamos a usar para cargar las canciones

useEffect(() =>{
    fetch(`http://localhost:4000/tracks/${userId}`)
    .then(respuesta => respuesta.json())
    .then( respuesta => {
       if(respuesta.error){
            //return navigate("/login");
            console.log("no user logged in");
       }
       console.log(respuesta);
       setTracks(respuesta);

    })
}, []) 

//Esta funcion se utiliza para cargar los archivos en el googledrive
    async function handleFileUpload(event) {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);

        //Le vamos a mandar el id del usuario y su user name para que pueda crear la carpeta, o identificarla si es necesario
        formData.append("id_user", activeUser.id_user);
        formData.append("user_name", activeUser.user_name);

        //Aqui hacemos el fetch para hacer el upload a la carpeta que necesitamos

        fetch('http://localhost:4000/upload', {
            method: 'POST',
            body: formData,
        })
        .then(response => response.json())
        .then(data => {

            //Si todo sale bien se agrega al estado de las tracks la nueva cancion con su url 
            console.log('File uploaded successfully:', data);
            const newTrack = {
                id_track: data.trackData, //aqui retorna el ID creado
                url: `http://localhost:4000/proxy?id=${data.fileId}`, //aqui va el url del servidor cuando cargue en render
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

        //console.log(id_track, title, artist);

        let trackToChange = tracks.find( track => track.id_track === id_track);
        trackToChange.title = title;
        trackToChange.artist = artist;
        
        let updatedTracks = tracks.map(tracks => tracks);
        setTracks(updatedTracks);

        // Make the PUT request to update the database
        const updateBD = await fetch(`http://localhost:4000/updateTrack/${id_track}`, {

            method: 'PUT',
            body: JSON.stringify({ title: title, artist: artist }),
            headers: {
            'Content-Type': 'application/json'
            },
            
        });

        const response = await updateBD.json();

        if (response.error) {
            console.error('Error updating track:', response.error);
        } else {
            console.log('Track updated successfully:', response);
        }



        
    }

    async function onDelete(id_track) {
        try {
            const response = await fetch(`http://localhost:4000/delete-file/${id_track}`, {
                method: 'DELETE'
            });

            if (response.ok) {
                setTracks(tracks.filter(track => track.id_track !== id_track));
                console.log('Track deleted successfully');
            } else {
                console.error('Failed to delete track');
            }
        } catch (error) {
            console.error('Error deleting track:', error);
        }
    }

    async function logOut() {
        try {
          const response = await fetch("http://localhost:4000/logout", {
            method: "GET"
          });
          const data = await response.json();
          console.log(data);
          if (data.message === 'Logged out successfully') {
            // Perform any additional logout actions, like redirecting to the login page
            
            return navigate("/login")
            console.log("User logged out");
          }
        } catch (error) {
          console.error('Error logging out:', error);
        }
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
                ) : ( <p> Loading tracks...</p> ) }
                <div className="creative-code-space"></div>
            </div>
            <section>
                <form onSubmit={handleFileUpload} encType="multipart/form-data">
                    <input type="file" name="mp3file" accept=".mp3" />
                    <input type="submit" value="Add tracks" />
                </form>
                <div>
                    {tracks.length > 0 ? tracks.map(({ id_track, title, artist }, index) =>
                        <SongContainer key={id_track} id_track={id_track} title={title} artist={artist} onPlay={()=> onPlay(index)} onEdit = {onEdit} onDelete={onDelete} />
                    ) : <p>No existen canciones</p>}
                </div>
            </section>
        </>
    );
}

export default Home;
