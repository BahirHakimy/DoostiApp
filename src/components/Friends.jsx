/**@jsxImportSource @emotion/react */
// import { IoIosNotificationsOutline } from "react-icons/io";
// import { BiUserPin } from "react-icons/bi";
import React from "react";
import "./styles/friends.css";
import FriendsSearch from "./screens/friends/FriendsSearch";
import FriendProfile from "./screens/friends/FriendProfile";
import FriendsDisplayList from "./screens/friends/FriendsDisplayList";
import RequestsAndNotfications from "./screens/friends/FriendRequests";
import { useTheme, useUser } from "./common/hooks";

const Friends = ({ onMessageClick }) => {
  const { username } = useUser();
  const [selectedFriend, setSelectedFriend] = React.useState();
  const [trigger, updateTrigger] = React.useState(1);
  const { currentTheme } = useTheme();

  function handleFriendSelection(profile) {
    setSelectedFriend(profile);
  }

  return (
    <div id="parentContainer">
      <RequestsAndNotfications
        updateTrigger={updateTrigger}
        username={username}
        onProfileClick={setSelectedFriend}
        theme={currentTheme}
      />
      <div
        id="leftContainer"
        style={
          currentTheme === "dark"
            ? {
                background: "var(--gradient-darkIndiago)",
              }
            : {}
        }
      >
        <FriendsSearch
          theme={currentTheme}
          currentUser={username}
          onSelect={handleFriendSelection}
        />
      </div>
      <div
        id="rightFriendDisplayContainer"
        style={
          currentTheme === "dark"
            ? {
                background: "var(--gradient-dark)",
              }
            : {}
        }
      >
        {selectedFriend ? (
          <FriendProfile
            username={selectedFriend.user.username}
            currentUser={username}
            onClose={handleFriendSelection}
            onMessageClick={onMessageClick}
            theme={currentTheme}
          />
        ) : (
          <FriendsDisplayList
            theme={currentTheme}
            reRender={trigger}
            username={username}
            onSelect={handleFriendSelection}
          />
        )}
      </div>
    </div>
  );
};

export default Friends;
