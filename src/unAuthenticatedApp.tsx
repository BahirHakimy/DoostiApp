import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { Navbar } from './components/Shared';
import Login from './components/Login';
import PersonalInfo from './components/PersonalInfo';
import Register from './components/Register';
import Tabs from './components/tabs/Tabs';

function UnAuthenticated() {
  const [user, setUser] = React.useState(null);
  function goToNextPage(user) {
    setUser(user);
  }

  return (
    <div>
      <div
        id="mainPageContainer"
        style={{
          display: 'flex',
          backdropFilter: 'blur(5px)',
        }}
      >
        <Navbar isAuth={false} />
        {!user && (
          <img
            alt="logo"
            src={'./assets/logo/logo-512.png'}
            width="512px"
            height="512px"
          />
        )}
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/register"
            element={
              user ? (
                <PersonalInfo user={user} />
              ) : (
                <Register nextPage={goToNextPage} />
              )
            }
          />
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </div>
    </div>
  );
}

export default UnAuthenticated;

