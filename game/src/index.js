import React from 'react';
import ReactDOM from 'react-dom/client';
import GroupSelect from './GroupSelect';
import App from './App';
import Admin from './admin';

import './index.css';
import 'bootstrap/dist/css/bootstrap.css';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { createBrowserRouter, RouterProvider } from "react-router-dom"

import img from './assets/imgs/LDP-GAME.jpg'
import CoverImage from './views/CoverImage';

const router = createBrowserRouter([
  {
    path: '/contest',
    element: <GroupSelect />
  },
  {
    path: '/contest/:groupCode',
    element: <App />
  },
  {
    path: '/admin',
    element: <Admin />
  },
  {
    path: '*',
    element: <CoverImage src={img} />
  }
], { basename: process.env.PUBLIC_URL })



const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
    <ToastContainer />
  </React.StrictMode>
);