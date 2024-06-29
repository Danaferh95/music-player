import { useState } from 'react'
//import { useHistory } from 'react-router-dom';
import MusicPlayer from './MusicPlayer';
import SongContainer from './SongContainer';

import userFoto from "../../music-player-back/uploads/photos/profile.png"


function Home() {

 // const history = useHistory();

  const handleLogout = () => {
    // Perform logout operation here
   // history.push('/');
   console.log("LogOut");
  };

    let [songs, setSongs] = useState([
      {
        url: "https://audioplayer.madza.dev/Madza-Chords_of_Life.mp3",
        title: "Chords of Life",
        artist: "Madza",
        tags: ["house"],
      },
      {
        url: "https://audioplayer.madza.dev/Madza-Late_Night_Drive.mp3",
        title: "Madza - Late Night Drive",
        tags: ["dnb"],
        artist: "Madza"
      },
      {
        url: "https://audioplayer.madza.dev/Madza-Persistence.mp3",
        title: "Madza - Persistence",
        artist: "Madza - ",
        tags: ["dubstep"],
      },
    ])



  return (
    <>
     <header>   
        <div>
         <div>
          <span>Username</span>
          <button onClick={handleLogout}>Logout</button>
         </div>
          <img src={userFoto} alt="User" />
        </div>
      </header>
      <div className ="player-section">
        <MusicPlayer songs = {songs} autoPlayNextTrack = {true}/>
        <div className="creative-code-space"></div>
      </div>
     
      <section>
        <button>Add Songs</button>
        <div>
        
        { songs.length > 0 ? songs.map( ({id,title,artist}) =>  <SongContainer  id ={id} 
                                                                                  key = {id}
                                                                                  title = {title}
                                                                                  artist = {artist}
                                                            /> ) : <p>No existen caciones</p>
          }
        </div>
      </section>
    </>
  )
}

export default Home


