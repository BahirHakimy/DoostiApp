import React from 'react';
// import Authenticated from './authenticatedApp';
import UnAuthenticated from './unAuthenticatedApp';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useUser, ThemeProvider } from './components/common/hooks';
// import { isMobile } from './services/utils';
import MobilePage from './components/screens/misc/mobilePage';
import Tabs from './components/tabs/Tabs';
import TabTitle from './components/tabs/TabTitle';
import Tab from './components/tabs/Tab';

function Panel() {
  return (
    <div className="flex flex-col justify-start items-start gap-2">
      <p className="text-slate-400 text-sm my-2">
        Make changes to your account here, Click save when you are done
      </p>
      <label className="font-semibold text-white" htmlFor="name">
        Name
      </label>
      <input
        type="text"
        id="name"
        placeholder="Type your name here"
        className="w-full p-2 px-3 rounded-md bg-slate-900 border border-slate-700 text-white"
      />
      <label className="font-semibold text-white" htmlFor="username">
        Username
      </label>
      <input
        type="text"
        id="username"
        placeholder="Type your username here"
        className="w-full p-2 px-3 rounded-md bg-slate-900 border border-slate-700 text-white"
      />
      <button className="px-4 py-2 my-4 rounded-md bg-white text-slate-900 font-semibold">
        Save changes
      </button>
    </div>
  );
}

function App() {
  // const { isAuth } = useUser();
  // const isPhone = isMobile();
  return (
    <div className="flex justify-start dark:bg-slate-900">
      <Tabs>
        <Tab title="Account">Hello How are you</Tab>
        <Tab title="Pasword">The password tab</Tab>
      </Tabs>

      {/* <ToastContainer />
      {isPhone ? (
        <MobilePage />
      ) : isAuth ? (
        <ThemeProvider>
          <Authenticated />
        </ThemeProvider>
      ) : (
        <UnAuthenticated />
      )} */}
    </div>
  );
}

export default App;
