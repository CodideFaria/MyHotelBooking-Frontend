import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.scss';
import HotelsSearch from './routes/listings/HotelsSearch';
import UserProfile from './routes/user-profile/UserProfile';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import reportWebVitals from './reportWebVitals';
import Home from './routes/home/Home';
import { AuthProvider } from './contexts/AuthContext';
import HotelDetails from './routes/hotel-details/HotelDetails';
import Login from './routes/login/Login';
import Register from './routes/register/Register';
import AboutUs from './routes/about-us/AboutUs';
import BaseLayout from './routes/layouts/base-layout/BaseLayout';
import ForgotPassword from './routes/forgot-password/ForgotPassword';
import Checkout from 'routes/checkout/Checkout';
import BookingConfirmation from 'routes/booking-confimation/BookingConifrmation';
import NotFound from './routes/not-found/NotFound';


const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <AuthProvider>
        <BaseLayout />
      </AuthProvider>
    ),
    errorElement: <NotFound />,
    children: [
      {
        path: '/',
        element: <Home />,
      },
      {
        path: '/hotels',
        element: <HotelsSearch />,
      },
      {
        path: '/about-us',
        element: <AboutUs />,
      },
      {
        path: '/user-profile/:section?',
        element: <UserProfile />,
      },
      {
        path: '/login',
        element: <Login />,
      },
      {
        path: '/register',
        element: <Register />,
      },
      {
        path: '/hotel/:hotelId',
        element: <HotelDetails />,
      },
      {
        path: '/forgot-password',
        element: <ForgotPassword />,
      },
      {
        path: '/checkout',
        element: <Checkout />,
      },
      {
        path: '/booking-confirmation',
        element: <BookingConfirmation />,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <RouterProvider router={router} />
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
