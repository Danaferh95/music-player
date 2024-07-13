import { useState, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { DatosUsuario } from './Usuario.jsx'

function Login() {

  let [nombreUsuario, setUsuario] = useState("")
  let [password, setPassword] = useState("")


  let usuario = useContext(DatosUsuario)
  let navigate = useNavigate()


  return (
    


    <form onSubmit={ evento =>{ 
      evento.preventDefault();

      fetch("http://localhost:4000/login", {
        method : "POST",
        body : JSON.stringify({ user_name : nombreUsuario, user_password : password}),
        headers: {
          "Content-type" : "application/json"
        }
      })
      .then( respuesta => respuesta.json())
      .then((respuesta) => {
        if( respuesta.resultado == "ok"){

          usuario.logado = true
          //console.log(respuesta.id_user)
          usuario.id_user = respuesta.id_user
          return navigate("/")
        }

        console.log("..error")
      })

    }}>
      <input type="text"  placeholder="nombre usuario" value={nombreUsuario} onChange ={evento => setUsuario(evento.target.value)}/>
      <input type="password" placeholder="contraseña" value={password} onChange ={evento => setPassword(evento.target.value)}/>
      <input type="submit" value="log in" />

    </form>
    
  )
}

export default Login
