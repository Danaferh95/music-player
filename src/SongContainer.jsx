import { useState } from 'react'



function SongContainer({id_track, title, artist, onPlay, onEdit, onDelete},) {

  return (
    <div className = "song-div" onClick={onPlay}>
      <span>{title} - {artist}</span>
      <div>
        <button onClick={(event) => {event.stopPropagation(); onEdit(id_track) } } >Edit</button>
        <button onClick={(event) => {event.stopPropagation(); onDelete(id_track)} }>Delete</button>
      </div>
     
    </div>
  )
}

export default SongContainer
