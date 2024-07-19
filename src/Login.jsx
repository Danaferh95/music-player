/*
En este archivo vamos a gestionar la página del Login
useSate, useContext para gestionar 
useNavigate para gestionar la navegación al hacer logIN
DatosUsuario es nuestro contexto
CodeEffect es nuestro componente de código creativo

*/


import { useState, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { DatosUsuario } from './Usuario.jsx'
import CodeEffect from './components/CodeEffect';

//creamos nuestro Login

function Login() {

  //aqui seteamos la variable del nombreUsuario
  let [nombreUsuario, setUsuario] = useState("")
  //aqui seteamos la variable del password
  let [password, setPassword] = useState("")
  //aqui una variable donde identifica si no coincide ni el password o el user
  let [wrongUser, setWrongUser] = useState(false)


  //datos del contexto que pasamos desde el main.jsx
  let usuario = useContext(DatosUsuario)

  //navigate para gestionar la navegación
  let navigate = useNavigate()

  //retornamos la seccion con un h1, el formulario que gestiona el logIN y el componente de CodeEffect para que este en el background


  return (
    
    <section className = "login-container">
      <h1>RETRO PLAYER</h1>
      <form className = "login-box" onSubmit={ evento =>{ 
        evento.preventDefault();

        //aqui hacemos la peticion al backend para que haga el login, le pasamos en el body el user_name y el passowrd que ingreso el ususario
        fetch("https://music-player-backend-oawm.onrender.com/login", {
          method : "POST",
          body : JSON.stringify({ user_name : nombreUsuario, user_password : password}),
          headers: {
            "Content-type" : "application/json"
          }
        })
        .then( respuesta => respuesta.json())
        .then((respuesta) => {
          if( respuesta.resultado == "ok"){
            //si todo esta ok setWrongUser se setea en false
            setWrongUser(false)

            //el dato del usuario logado ahora es true
            usuario.logado = true

            //y nuestro id_user es la respuesta del back
            usuario.id_user = respuesta.id_user
            //navegamos al Home
            return navigate("/")
          }

          console.log("..error")
          //si esque esta incorrecto avisamos pasamos este estado a verdadero y la app reflejara un mensaje de error como vemos mas abajo
          setWrongUser(true)
        })

      }}>
        <input type="text"  placeholder="nombre usuario" value={nombreUsuario} onChange ={evento => setUsuario(evento.target.value)}/>
        <input type="password" placeholder="contraseña" value={password} onChange ={evento => setPassword(evento.target.value)}/>
        <input type="submit" value="log in" />
        <p className = {!wrongUser ? "invisible" : ""}>Usuario o contraseña incorrecta</p>

      </form>
      <CodeEffect />
    </section>
    
  )
}

export default Login
