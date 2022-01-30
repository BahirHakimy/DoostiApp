/** @jsxImportSource @emotion/react */
import React from "react";
import "./styles/messages.css";
import { FriendListItem, ErrorBox } from "./Shared";
import { ListItem, Spinner } from "./lib";
import { axios } from "../services/client";
import ChatPanel from "./screens/messages/chatPanel";
import ChatRooms from "./screens/messages/chatRooms";
import { useTheme, useUser } from "./common/hooks";
import { toast } from "react-toastify";
import { useAsync } from "./../services/utils";
import { capitalize } from "lodash";

function Messages({ contact = null }) {
  const ACTION_TYPES = {
    SET_ROOM: 0,
    SET_USER: 1,
    CLOSE: 2,
  };
  const user = useUser();
  const { currentTheme } = useTheme();
  const [state, dispatch] = React.useReducer(stateReducer, {
    chatType: contact && "PR",
    friend: contact,
  });
  const { run, data, error, isIdle, isPending, isRejected, isSuccess } =
    useAsync();

  React.useEffect(() => {
    run(
      axios.post(
        "rooms/friends-and-recent/",
        { username: user.username },
        { baseURL: process.env.REACT_APP_ASGI_URL }
      )
    );
  }, [run, user.username]);

  function stateReducer(state, action) {
    switch (action.type) {
      case ACTION_TYPES.SET_ROOM:
        return {
          ...state,
          chatType: "PB",
          room: action.roomName,
          friend: null,
          createRoom: action.create,
        };
      case ACTION_TYPES.SET_USER:
        return {
          ...state,
          chatType: "PR",
          friend: action?.friend,
          room: null,
          createRoom: false,
        };
      case ACTION_TYPES.CLOSE:
        return { chatType: null };

      default:
        throw new Error("This should be impossible");
    }
  }

  function handleCreateRoom(room) {
    axios
      .post(
        "rooms/create/",
        { username: user.username, room },
        { baseURL: process.env.REACT_APP_ASGI_URL }
      )
      .then(
        ({ data }) => {
          toast(data.message);
          dispatch({ type: ACTION_TYPES.SET_ROOM, roomName: room });
        },
        (error) => {
          console.log(error.response.status);
          if (error?.response?.status === 400) {
            toast.warn(error?.response?.data?.message);
          } else {
            toast.error(error.message);
          }
        }
      );
  }

  function handleRoomSelect(roomName) {
    dispatch({
      type: ACTION_TYPES.SET_ROOM,
      roomName,
      create: false,
    });
  }

  function handleFriendSelect(friend) {
    dispatch({ type: ACTION_TYPES.SET_USER, friend });
  }

  if (isIdle || isPending) {
    return (
      <div className={`fullcenter ${currentTheme}`}>
        <Spinner
          size="30px"
          color={currentTheme === "light" ? "var(--dark)" : "var(--light)"}
        />
      </div>
    );
  }
  if (isRejected) {
    return (
      <div className={`fullcenter ${currentTheme}`}>
        <ErrorBox error={error?.message} />
      </div>
    );
  }

  if (isSuccess) {
    const { chatType, room, friend } = state;
    const { friends, recent_chats } = data;
    return (
      <div id="messagePageContainer">
        <div id="sideList" className={`theme-sidelist${currentTheme}`}>
          <ul id="favorites">
            <ListItem border={true} aria-label="title">
              <h4 css={{ color: "white" }}>
                Friends <span>({friends.length})</span>
              </h4>
            </ListItem>
            <div
              aria-label="chats"
              css={{
                maxHeight: "15rem",
                overflowY: "scroll",
              }}
            >
              {friends.length > 0 ? (
                friends.map((fr) => (
                  <FriendListItem
                    key={fr.username}
                    img={fr.profile_pic}
                    name={capitalize(fr.fullname)}
                    username={fr.username}
                    onSelect={handleFriendSelect}
                  />
                ))
              ) : (
                <p className="text-light">No friends</p>
              )}
            </div>
          </ul>
          <ul id="recent">
            <ListItem border={true} aria-label="title">
              <h4 css={{ color: "white" }}>
                Recent chats <span>({recent_chats.length})</span>
              </h4>
            </ListItem>
            <div aria-label="chats" id="chatsContainer">
              {recent_chats.length > 0 ? (
                recent_chats.map((rc) => {
                  switch (rc.chat_type) {
                    case "PB":
                      return (
                        <FriendListItem
                          key={rc.name}
                          room={true}
                          tag={rc.unread}
                          name={capitalize(rc.name)}
                          username={rc.name}
                          onSelect={handleRoomSelect}
                        />
                      );
                    case "PR":
                      return (
                        <FriendListItem
                          key={rc.username}
                          img={rc.profile_pic}
                          tag={rc.unread}
                          name={capitalize(rc.fullname)}
                          username={rc.username}
                          onSelect={handleFriendSelect}
                        />
                      );
                    default:
                      return <div>Nothing</div>;
                  }
                })
              ) : (
                <p className="text-light">No recent chats</p>
              )}
            </div>
          </ul>
        </div>
        <main className={`main-theme-${currentTheme}`}>
          {chatType === null ? (
            <ChatRooms
              theme={currentTheme}
              goToRoom={handleRoomSelect}
              createRoom={handleCreateRoom}
            />
          ) : chatType === "PB" ? (
            <ChatPanel
              theme={currentTheme}
              onClose={() => dispatch({ type: ACTION_TYPES.CLOSE })}
              chatType="public"
              username={user.username}
              roomName={room}
            />
          ) : (
            <ChatPanel
              theme={currentTheme}
              onClose={() => dispatch({ type: ACTION_TYPES.CLOSE })}
              chatType="private"
              username={user.username}
              contact={friend}
            />
          )}
        </main>
      </div>
    );
  }
}

export { Messages };
