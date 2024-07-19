/*

useContext para utilizar nuestro DatosUsuario y traernos los datos del ususario que especificamos en el main.jsx
Navigate para regresar el login si vemos que el ususario no esta loggado
Home que es nuestro Home.jsx donde enviamos los datos del id_user para cargar la musica relacionado a ese usuario

*/


import { useContext } from 'react'
import { Navigate} from 'react-router-dom'
import { DatosUsuario } from './Usuario.jsx'
import Home from './Home.jsx'

function App() {


    let usuario = useContext(DatosUsuario)
    
    return (
        <>  
            
            { 
            !usuario.logado ? <Navigate to = "/login" /> :
              <Home id_user = {usuario.id_user} />
            }
          
        </>
    )
}

export default App


