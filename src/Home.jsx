import { useState } from 'react';
import MusicPlayer from './MusicPlayer';
import SongContainer from './SongContainer';
import userFoto from "../../music-player-back/uploads/photos/profile.png";
import song1 from "../../mymusic/Escape-Just Escape.mp3";
import song2 from "../../mymusic/HotSince82-Restless.mp3";
import song3 from "../../mymusic/Betoko-Just Live.mp3";

function Home() {
    const [songs, setSongs] = useState([
        { id: 1, url: song1, title: "Just Escape (Justin Martin Remix)", artist: "Escape" },
        { id: 2, url: song2, title: "Restless", artist: "Hot since 82" },
        { id: 3, url: song3, title: "Just live", artist: "Betoko" }
    ]);
    const [curTrack, setCurTrack] = useState(0);

    function setTheCurTrack(newTrack) {
        setCurTrack(newTrack);
    }

    function onPlay(id) {
        setTheCurTrack(id - 1);
    }

    async function handleFileUpload(event) {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        fetch('http://localhost:4000/upload', {
            method: 'POST',
            body: formData,
        })
        .then(response => response.json())
        .then(data => console.log('File uploaded successfully:', data))
        .catch(error => console.error('Error uploading file:', error));
    };

    return (
        <>
            <header>
                <div>
                    <div>
                        <span>Username</span>
                        <button onClick={() => console.log("LogOut")}>Logout</button>
                    </div>
                    <img src={userFoto} alt="User" />
                </div>
            </header>
            <div className="player-section">
                <MusicPlayer songs={songs} autoPlayNextTrack={true} curTrack={curTrack} setTheCurTrack={setTheCurTrack} />
                <div className="creative-code-space"></div>
            </div>
            <section>
                <form onSubmit={handleFileUpload} encType="multipart/form-data">
                    <input type="file" name="mp3file" accept=".mp3" />
                    <input type="submit" value="Add Songs" />
                </form>
                <div>
                    {songs.length > 0 ? songs.map(({ id, title, artist }) =>
                        <SongContainer key={id} id={id} title={title} artist={artist} onPlay={onPlay} />
                    ) : <p>No existen canciones</p>}
                </div>
            </section>
        </>
    );
}

export default Home;
