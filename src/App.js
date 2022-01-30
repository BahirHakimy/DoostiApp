import "./App.css";
import React from "react";
import Authenticated from "./authenticatedApp";
import UnAuthenticated from "./unAuthenticatedApp";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useUser } from "./components/common/hooks";
import { ThemeProvider } from "./components/common/hooks";

function App() {
  const { isAuth } = useUser();

  return (
    <div className="App">
      <ToastContainer />
      {isAuth ? (
        <ThemeProvider>
          <Authenticated />
        </ThemeProvider>
      ) : (
        <UnAuthenticated />
      )}
    </div>
  );
}

export default App;
