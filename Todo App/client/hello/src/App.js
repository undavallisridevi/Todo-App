import React, { useState } from "react";
import Form from "./components/form";
import ModalDisplay from "./components/modal";
import { BrowserRouter, createBrowserRouter, Route, RouterProvider, Routes } from "react-router-dom";
import { Menu } from "semantic-ui-react";
import Root from "./components/root";
import Login from "./components/login";
import Auth from "./components/auth";
import ErrorPage from "./components/error";
import Cookies from "universal-cookie/es6";



export default function App() {
  const cookie = new Cookies();

const isAdmin = cookie.get("role") === "true";

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
         path: "",
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