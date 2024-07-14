import { useState } from 'react'
//iconos
import editIcon from "./assets/edit-icon.png";
import saveIcon from "./assets/save-icon.png";
import deleteIcon from "./assets/delete-icon.png";


function SongContainer({id_track, title, artist, onPlay, onEdit, onDelete},) {

  let [editando, setEditando] = useState(false)
   
  let [titleTemporal, setTitleTemporal] = useState(title)
  let [artistaTemporal, setArtistaTemporal] = useState(artist)


  return (
    <div className = "song-div" onClick={onPlay}>
    <div className = {!editando ? "invisible" : ""}>
      <input type="text" value={titleTemporal} onChange={ evento =>{setTitleTemporal(evento.target.value)}}/>
      <input type="text" value={artistaTemporal} onChange={ evento =>{setArtistaTemporal(evento.target.value)}}/>
    </div>
    <span className= {editando ? "invisible" : ""}>{title} - {artist}</span>

      <div className = "song-div-button-container">
        <button  onClick= { (e) => {

                                  e.stopPropagation();
                                  if(editando){
                                      
                                      if(titleTemporal.trim() != "" && artistaTemporal.trim() != "" ){
                                          onEdit(id_track, titleTemporal, artistaTemporal)
                                          console.log("guardar texto")
                                          setEditando(false)
                                      }
                                  }else{
                                      setEditando (true )
                                  }
                                  
                              }
                          } > {editando ? <img src={saveIcon} alt="" /> : <img src={editIcon} alt="" />}
        </button>
        <button onClick={(event) => {event.stopPropagation(); onDelete(id_track)} }><img src={deleteIcon} alt="" /></button>
      </div>
     
    </div>
  )
}

export default SongContainer
