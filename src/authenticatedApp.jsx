import { Messages } from './components/messages';
import { Navbar } from './components/Shared';
import NotFound from './components/notFound';
import Profile from './components/profile';
import Friends from './components/Friends';
import Setting from './components/settings';
import { useTheme, useUser } from './components/common/hooks';
import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { axios } from './services/client';

function Authenticated() {
  const { username } = useUser();
  const [profilePic, setProfilePic] = React.useState(null);
  const [defaultContact, setDefaultContact] = React.useState(null);
  const [flag, setFlag] = React.useState(0);
  const { currentTheme } = useTheme();

  React.useEffect(() => {
    axios.post('users/me/', { username }).then(
      ({ data }) => setProfilePic(data.profile_pic),
      (error) => console.log(error)
    );
  }, [username, flag]);

  function setContact(name) {
    setDefaultContact(name);
  }
  function refresh() {
    setFlag((prev) => prev + 1);
  }
  return (
    <div>
      <div id="mainPageContainer">
        <Navbar
          isAuth={true}
          dark={currentTheme === 'dark'}
          photo={profilePic}
        />
        <Routes>
          <Route path="/profile" element={<Profile refresh={refresh} />} />
          <Route
            path="/message"
            element={<Messages contact={defaultContact} />}
          />
          <Route
            path="/friends"
            element={<Friends onMessageClick={setContact} />}
          />
          <Route path="/not-found" element={<NotFound />} />
          <Route path="/settings" element={<Setting />} />
          <Route path="/" element={<Navigate to="/message" />} />
          <Route path="*" element={<Navigate to="/not-found" />} />
        </Routes>
      </div>
    </div>
  );
}

export default Authenticated;

