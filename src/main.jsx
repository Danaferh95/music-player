/*

En este jsx llamamos a los estilos del CSS
Importamos React y ReactDOM
react-router-dom para gestionar la navegación
Login y App para gestionar con el Router si esq primero se debe hacer log in para luego acceder a la app
DatosUsuario que es el contexto que creamos y vamos a pasarlo a nuestro ficheros

*/

import './estilos.css'
import React from 'react'
import ReactDOM from 'react-dom/client'
import {createBrowserRouter, RouterProvider}  from 'react-router-dom'
import Login from './Login.jsx'
import App from './App.jsx'

import { DatosUsuario } from './Usuario.jsx'

//los datos del ususario que vamos a pasar a través del contexto
const usuario = {logado : false , id_user : 0}

//router para gestionar navegación
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

//Nuestra pp
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <DatosUsuario.Provider value= {usuario} >
       <RouterProvider router= {router} />
    </DatosUsuario.Provider>
  </React.StrictMode>
)
