/*
Este es nuestro componente para gestionar la barra de progreso
Recibe el value, onChange, onMouseup, onTouchEnd y progress


El value establece el valor actual de la barra de rango.
Progress es el valor del buffer

onChange vincula la función que se ejecuta cuando cambia el valor de la barra de rango.
onMouseUp vincula la función que se ejecuta cuando se suelta el botón del ratón.
onTouchEnd  vincula la función que se ejecuta cuando se termina un toque en una pantalla táctil.
*/


import React from "react";

export const Progress = ({
  value,
  onChange,
  onMouseUp,
  onTouchEnd,
  progress,
}) => {
  return (
    <div>
      <input
        type="range"
        min="1"
        max="100"
        step="1"
        value={value}
        id="myRange"
        onChange={onChange}
        onMouseUp={onMouseUp}
        onTouchEnd={onTouchEnd}
        style={{
          //aqui seteamos el color del fondo del progreso, con un linear gradient que va identificando el value y el progress, para pintar
          //acorde de en que porcentaje de la cancion vamos y por otro lado identificar hasta donde se encuentra el buffer
          background: `linear-gradient(90deg, var(--color2) 0%, 
          white ${Math.floor(
            value
          )}%, 
          var(--color4) ${Math.floor(
            value
          )}%, 
          var(--color4) ${Math.floor(
            progress
          )}%, 
          var(--color3) ${Math.floor(
            progress
          )}%, 
          black 100%)`
          
        }}
      />
    </div>
  );
};