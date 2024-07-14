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


