import { useState } from 'react'



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

      <div>
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
                          } > {editando ? "save" : "edit"}
        </button>
        <button onClick={(event) => {event.stopPropagation(); onDelete(id_track)} }>Delete</button>
      </div>
     
    </div>
  )
}

export default SongContainer
