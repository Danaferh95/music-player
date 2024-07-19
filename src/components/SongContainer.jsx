/*
Este es un componente SongContainer que sirve para cargar un div donde tendremos la accion de darPlay, el nombre de la cancion y su artista.
Los boton para editar el titulo/artista y el boton para borrar la canción

*/

import { useState } from 'react'


//iconos
import editIcon from "../assets/edit-icon.png";
import saveIcon from "../assets/save-icon.png";
import deleteIcon from "../assets/delete-icon.png";

//Recibe id_track, title, artist, onPLay, onEdit y onDelete
function SongContainer({id_track, title, artist, onPlay, onEdit, onDelete},) {

  //Variable para ver si se encuentra en edición o no
  let [editando, setEditando] = useState(false)
  
  //Titulo temporal y artista temporal como variables para que luego podamos actualizar con esa información en la BBDD
  let [titleTemporal, setTitleTemporal] = useState(title)
  let [artistaTemporal, setArtistaTemporal] = useState(artist)

  //retornamos el HTML
  //Identificamos si el estado esta editando o no, si se encuentra editando entonces quitamos la clase invisible y se mostrara el input con el evento para 
  //actualizar el titulo y el artista
  //Por otro lado aparecerá por default un span con el titulo y el artista

  //luego veremos que tenemos el song-div-button-container donde estaran los botones de Edit y Delete, los cuales se les asigna las funciones de onEdita y onDelete
  //que podemos encontrar en el Home.jsx


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
                                      //Aquí verificamos que titleTemporal y artistaTemporal con trim no se encuentren vacias
                                      if(titleTemporal.trim() != "" && artistaTemporal.trim() != "" ){
                                        //entonces ahi llamamos ale onEdit y le pasamos id_track, el titleTempora y artistaTemporal para que actualice
                                          onEdit(id_track, titleTemporal, artistaTemporal)
                                          console.log("guardar texto")
                                          //por ultimo seteamos el editando en false para actualizar nuevamente al estado anterior
                                          setEditando(false)
                                      }
                                  }else{
                                    //set editando en true para que aparezcan los inputs
                                      setEditando (true )
                                  }
                                  
                              }
                              //cambiamos los iconos según se encuentr editando en verdadero o no
                          } > {editando ? <img src={saveIcon} alt="" /> : <img src={editIcon} alt="" />}
        </button>
        <button onClick={(event) => {

                                  //al hacer click llamamos a la funcion de onDelete que se encuentra en nuestro Home.jsx
                                    event.stopPropagation(); 
                                    onDelete(id_track)} 
                                    }>
                <img src={deleteIcon} alt="" />
        </button>
      </div>
     
    </div>
  )
}

export default SongContainer
