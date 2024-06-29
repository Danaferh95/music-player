import { useState } from 'react'



function SongContainer({title, artist, onPlay, onEdit, onDelete}) {

  return (
    <div>
      <span>{title} - {artist}</span>
      <button onClick={() => onEdit(song)}>Edit</button>
      <button onClick={() => onDelete(song)}>Delete</button>
    </div>
  )
}

export default SongContainer
