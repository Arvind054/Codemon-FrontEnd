import React from 'react'
import Home from './components/Home'
import CreateRoom from './components/CreateRoom'
import JoinRoom from './components/JoinRoom'
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import './App.css'
const App = () => {
  const router = createBrowserRouter([
    {path:"/",
      element: <JoinRoom></JoinRoom>
    },

    {
      path:"/new",
      element: <CreateRoom></CreateRoom>
    },
    {
      path: "/room/:id",
      element: <Home></Home>
    }
  ])
  return (
   <>
   <RouterProvider router={router}></RouterProvider>
   </>
  )
}

export default App
