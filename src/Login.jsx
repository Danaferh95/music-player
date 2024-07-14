import { useState, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { DatosUsuario } from './Usuario.jsx'
import CodeEffect from './components/CodeEffect';
function Login() {

  let [nombreUsuario, setUsuario] = useState("")
  let [password, setPassword] = useState("")
  let [wrongUser, setWrongUser] = useState(false)

  let usuario = useContext(DatosUsuario)
  let navigate = useNavigate()


  return (
    
    <section className = "login-container">
      <h1>RETRO PLAYER</h1>
      <form className = "login-box" onSubmit={ evento =>{ 
        evento.preventDefault();

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
            setWrongUser(false)
            usuario.logado = true
            //console.log(respuesta.id_user)
            usuario.id_user = respuesta.id_user
            return navigate("/")
          }

          console.log("..error")
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
