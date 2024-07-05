import { useState } from 'react'



function SongContainer({id, title, artist, onPlay, onEdit, onDelete}) {

  return (
    <div className = "song-div" onClick={()=> onPlay(id)}>
      <span>{title} - {artist}</span>
      <div>
        <button onClick={() => onEdit(song)}>Edit</button>
        <button onClick={() => onDelete(song)}>Delete</button>
      </div>
     
    </div>
  )
}

export default SongContainer
