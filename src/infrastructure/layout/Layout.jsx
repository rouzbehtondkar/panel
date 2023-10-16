import React, { useState,useContext } from 'react';
import { Routes, Route } from 'react-router-dom';
import RouteUnauthorize from '../../route/RouteUnauthorized';
import Authoriz from '../authorized/Authoriz';
import { useAuthState } from '../../context/Auth-context';
export default function Layout() {
  //  const [token,setToken] = useState('');
    const {token}=useAuthState()

  return (

    <Routes>
      {token ? (
        <Route path='/*' element={<Authoriz/>} />
        ) : (
          <Route path='/*' element={<RouteUnauthorize/>} />
          )}
    </Routes>
     
  );
}


