import React, { useEffect, useState } from "react";
import Form from "./components/form";
import ModalDisplay from "./components/modal";
import {  createBrowserRouter, RouterProvider} from "react-router-dom";
import Root from "./components/root";
import Login from "./components/login";
import Auth from "./components/auth";
import ErrorPage from "./components/error";
import Cookies from "universal-cookie/es6";



export default function App() {
  const cookie = new Cookies();

const [isAdmin, setIsAdmin] = useState(cookie.get("admin") === "true");
    
useEffect(() => {
  setIsAdmin(cookie.get("admin") === "true");
}, []);

const router=createBrowserRouter(!isAdmin
  ?[
    {
      path: "/",
      element: <Root />,
      children: [
        {
          path: "login",
          element: <Login />,
        },
        {
          path: "",
         element: <ModalDisplay />,
       },
       
       {
          path: "todo/authenticate",
          element: <Auth />,
        }, {
          path: "*",
          element: <ErrorPage />,
        }
      ],
    },
  ]
 
 :  [
  {
    path: "/",
    element: <Root />,
    children: [
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "/admin",
        element: <Form />,
        },
      {
         path:"",
        element: <ModalDisplay />,
      },
      
      {
        path: "todo/authenticate",
        element: <Auth />,
      },
      {
        path: "*",
        element: <ErrorPage />,
      },
    ],
  },
]  )
  return (
    <React.StrictMode>
   
  
      <RouterProvider router={router} />

  
     
    </React.StrictMode>
  );
}