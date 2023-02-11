import './App.css';
import React from 'react';
import Authenticated from './authenticatedApp';
import UnAuthenticated from './unAuthenticatedApp';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useUser, ThemeProvider } from './components/common/hooks';
import { isMobile } from './services/utils';
import MobilePage from './components/screens/misc/mobilePage';

function App() {
  const { isAuth } = useUser();
  const isPhone = isMobile();
  return (
    <div className="App">
      <ToastContainer />
      {isPhone ? (
        <MobilePage />
      ) : isAuth ? (
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

