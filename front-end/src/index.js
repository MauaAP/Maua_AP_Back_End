import React from "react";
import * as ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider, } from "react-router-dom";
import axios from "axios";
import 'bootstrap/dist/css/bootstrap.min.css';


import Main from "./pages/main-page"
import Login from "./pages/login-page";
import ErrorPage from "./pages/error-page"
import ViewPage from "./pages/view-page"
import UserInfoPage from "./pages/userinfo-page";
import EventInfoPage from "./pages/eventinfo-page";


const router = createBrowserRouter([
  {
    path: "/",
    element: <Login />,
    errorElement: <ErrorPage/>,
    id: "root"
  },
  {
    path: "main",
    element: <Main />,
    errorElement: <ErrorPage/>,
    
    children: [
      {
        path: "usuarios",
        children: [
          {
            path: "visualizar",
            element: <ViewPage secao="Usuários" path='/main/usuarios/visualizar'/>,
            loader: async () => {
              console.log(`Executando loader do view para usuários.`)
              let res = await axios.get(`http://localhost:3000/users`).then(
                (response) => {return response}
              )
              console.log(`\nNo index, res:\n${res}\n`)
              return res
            }
          },
          {
            path: "adicionar",
            element: <UserInfoPage create={true} target="usuario" />
          },
          {
            path: "remover",
            element: <UserInfoPage delete={true} target="usuario" />
          },
          {
            path: "atualizar",
            element: <UserInfoPage update={true} target="usuario" />
          }
        ]
      },
      {
        path: "eventos",
        children: [
          {
            path: "visualizar",
            element: <ViewPage secao="Eventos" path='/main/eventos/visualizar'  />,
            loader: async () => {
              console.log(`Executando loader do view para eventos.`)
              let res = await axios.get(`http://localhost:3000/events`).then(
                (response) => {return response}
              )
              console.log(`\nNo index, res:\n${res}\n`)
              return res
            }
          },
          {
            path: "adicionar",
            element: <EventInfoPage create={true} target="evento" />
          },
          {
            path: "remover",
            element: <EventInfoPage delete={true} target="evento" />
          },
          {
            path: "atualizar",
            element: <EventInfoPage update={true} target="evento" />
          }
        ]
      },
    ],
  },

]);

ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>
      <RouterProvider router={router} />
    </React.StrictMode>
  );