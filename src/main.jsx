import './estilos.css'
import React from 'react'
import ReactDOM from 'react-dom/client'
import {createBrowserRouter, RouterProvider}  from 'react-router-dom'
import Login from './Login.jsx'
import App from './App.jsx'

import { DatosUsuario } from './Usuario.jsx'


const usuario = {logado : false , id_user : 0}

const router = createBrowserRouter([
  {
    path : "/",
    element: <App />
  },
  {
    path : "/login",
    element: <Login />
  }
])


ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <DatosUsuario.Provider value= {usuario} >
       <RouterProvider router= {router} />
    </DatosUsuario.Provider>
  </React.StrictMode>
)
