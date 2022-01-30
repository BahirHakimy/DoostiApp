import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { Navbar } from "./components/Shared";
import Login from "./components/Login";
import PersonalInfo from "./components/PersonalInfo";
import Register from "./components/Register";

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
          background: "url(assets/backgrounds/bg1.jpg)",
          display: "flex",
        }}
      >
        <Navbar isAuth={false} />
        {!user && (
          <img src="assets/logo512.png" width="512px" height="512px" alt="logo" />
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
          <Route path="/" element={<Navigate to="/login"  />}  />
        </Routes>
      </div>
    </div>
  );
}

export default UnAuthenticated;
