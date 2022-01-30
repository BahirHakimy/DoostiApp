/**@jsxImportSource @emotion/react */
import React from "react";
import { capitalize } from "lodash";
import { FaArrowLeft, FaCheckCircle, FaHome, FaUsers } from "react-icons/fa";
import { ErrorBox, MessageContainer } from "../../Shared";
import MessageInput from "./MessageInput";
import {
  Div,
  InlineDiv,
  ProfileImage,
  Spinner,
  LoadingSpinner,
} from "../../lib";
import { axios } from "../../../services/client";
import { useAsync, useSocket } from "../../../services/utils";
import { RiMessageFill } from "react-icons/ri";

const ChatPanel = ({
  chatType,
  username,
  contact,
  roomName,
  onClose,
  theme,
}) => {
  const messageContainerRef = React.useRef();
  const [loadingState, setLoadingState] = React.useState({
    firstReached: false,
    isLoading: false,
  });
  const {
    run,
    data,
    setData,
    error,
    isIdle,
    isPending,
    isRejected,
    isSuccess,
  } = useAsync();
  const {
    sendMessage,
    onMessage,
    status: socketState,
  } = useSocket(process.env.REACT_APP_WEBSOCKET_URL);

  // Retrieving the messages from the server via http request
  React.useEffect(() => {
    if (!chatType) return;
    switch (chatType) {
      case "public":
        run(
          axios.post(
            "rooms/get/",
            { chatType: "PB", roomName, username },
            { baseURL: process.env.REACT_APP_ASGI_URL }
          )
        );
        break;
      case "private":
        run(
          axios.post(
            "rooms/get/",
            { chatType: "PR", username, contact },
            { baseURL: process.env.REACT_APP_ASGI_URL }
          )
        );
        break;
      default:
        console.error("no chat type");
    }
    return () => setLoadingState({ isLoading: false, firstReached: false });
  }, [chatType, username, contact, roomName, run]);

  // Sending the current chat info to create a chat channel in the server via WebSocket
  React.useEffect(() => {
    switch (chatType) {
      case "public":
        sendMessage(
          JSON.stringify({
            command: "goToRoom",
            roomName,
            username,
            chatType: "PB",
          }),
          true
        );
        break;
      case "private":
        sendMessage(
          JSON.stringify({
            command: "goToRoom",
            username,
            contact,
            chatType: "PR",
          }),
          true
        );
        break;

      default:
        console.error("No chat type");
    }
  }, [roomName, contact, username, chatType, sendMessage]);

  // Scroll the page to the last message after data is received
  React.useEffect(() => {
    if (!data || !data.conversation) return;
    doScroll();
  }, [data]);

  // Send the last message id to server to mark messages as read
  React.useEffect(() => {
    if (!data || !data.conversation) return;
    if (data.conversation.length > 0) {
      sendMessage(
        JSON.stringify({
          command: "markAsRead",
          username,
          room_id: data.contact_profile.room_id,
          last_message: data.conversation[data.conversation.length - 1].id,
        })
      );
    }
  }, [data, sendMessage, username]);

  // Scrolling to bottom of the message container
  function doScroll() {
    messageContainerRef.current.scroll(
      0,
      messageContainerRef.current.scrollHeight
    );
  }

  // Load the previous messages when user scroll to the first message
  function handleScroll(event) {
    if (loadingState.firstReached) return;
    const element = event.target;
    const top = element.scrollTop;
    if (top === 0) {
      setLoadingState({ isLoading: true, firstReached: false });
      axios
        .post(
          "rooms/messages/",
          {
            room_id: data?.contact_profile?.room_id,
            lastmessage_id: data?.conversation[0].id,
          },
          { baseURL: process.env.REACT_APP_ASGI_URL }
        )
        .then(
          (response) => {
            if (response.data.length > 0) {
              setData({
                ...data,
                conversation: [...response.data, ...data.conversation],
              });
              setLoadingState({ isLoading: false, firstReached: false });
            } else {
              setLoadingState({ isLoading: false, firstReached: true });
            }
          },
          (error) => {
            console.log(error.message);
            setLoadingState({ isLoading: false, firstReached: false });
          }
        );
    }
  }

  function handleSend(message) {
    sendMessage(
      JSON.stringify({
        command: "newMessage",
        message: message,
        author: username,
        chatId: data?.contact_profile?.room_id,
      })
    );
  }

  onMessage((response) => {
    const { message } = JSON.parse(response.data);
    const { conversation } = data;
    const newData = { ...data, conversation: [...conversation, message] };
    setData(newData);
  });

  if (isIdle || isPending) {
    return (
      <div className="fullcenter">
        <Spinner
          size="30px"
          color={theme === "light" ? "var(--dark)" : "var(--light)"}
        />
      </div>
    );
  }
  if (isRejected) {
    return (
      <div className="fullcenter">
        <ErrorBox error={error?.message} />
      </div>
    );
  }

  if (isSuccess) {
    const { conversation, contact_profile: contact } = data;
    return (
      <div
        css={{
          display: "grid",
          gridTemplateRows: "auto 5rem",
          height: "100%",
          maxHeight: "100%",
        }}
      >
        <div
          aria-label="chats display"
          css={{
            padding: ".2rem 1rem",
            position: "relative",
            background: theme === "light" ? "var(--light)" : "var(--dark)",
          }}
        >
          <div
            onClick={onClose}
            title="Close"
            css={{
              display: "flex",
              position: "absolute",
              color: "var(--info)",
              top: "1rem",
              left: "2.3rem",
              cursor: "pointer",
              ":hover": {
                color: "var(--primary)",
              },
            }}
          >
            <FaArrowLeft size="25px" />
            Back
          </div>
          <h4 className={`title-for${theme}`}>Conversations</h4>
          {roomName ? (
            <Div
              styleOverrides={{
                paddingLeft: "1rem",
                justifyContent: "space-between",
                borderColor: "var(--gray)",
              }}
            >
              <div className="flex">
                <FaHome
                  size="40px"
                  css={{ marginLeft: "1rem" }}
                  className={`title-for${theme}`}
                />
                <h5
                  css={{ marginLeft: ".5rem" }}
                  className={`title-for${theme}`}
                >
                  {capitalize(contact.name)}
                </h5>
              </div>
              <div
                className="flex"
                title="Room Members"
                css={{ marginRight: "1rem", userSelect: "none" }}
              >
                <FaUsers size="20px" className={`title-for${theme}`} />
                <span className={`title-for${theme}`}>{contact.members}</span>
              </div>
            </Div>
          ) : (
            <Div
              styleOverrides={{
                borderColor: "var(--gray)",
                paddingLeft: "1rem",
              }}
            >
              <ProfileImage src={contact?.profile_pic} alt="profile_pic" />
              <h5 css={{ marginLeft: "10px" }} className={`title-for${theme}`}>
                {capitalize(contact?.fullname)}
              </h5>
            </Div>
          )}
          <span
            css={{
              display: "flex",
              justifyContent: "space-evenly",
              alignItems: "center",
              width: "6rem",
              position: "fixed",
              zIndex: "1500",
              margin: "auto",
              background:
                socketState === "Connected" ? "var(--success)" : "var(--info)",
              left: "59.5%",
              top: chatType === "public" ? "69px" : "80px",
              color: "var(--light)",
              padding: "0.2rem 0.6rem",
              borderRadius: "0.5rem 0.5rem 0 0",
            }}
          >
            {socketState}
            {socketState === "Connected" ? (
              <FaCheckCircle />
            ) : (
              <LoadingSpinner />
            )}
          </span>
          <div
            aria-label="messages_container"
            css={{
              position: "relative",
              overflowY: "scroll",
              maxHeight: "65vh",
              paddingTop: "2rem",
              scrollBehavior: "smooth",
            }}
            onScroll={handleScroll}
            ref={messageContainerRef}
          >
            {loadingState.isLoading && (
              <p
                css={{
                  position: "absolute",
                  fontFamily: "cursive",
                  width: "100%",
                  color: theme === "light" ? "var(--dark)" : "var(--light)",
                  transition: "all .3s",
                  top: "0",
                }}
                className="flex"
              >
                <Spinner color="var(--gray)" /> {"   "} Loading
              </p>
            )}
            {conversation.length > 0 ? (
              conversation.map((message, index) => {
                return (
                  <MessageContainer
                    file={message.attached_file}
                    fullname={message.author.fullname}
                    key={message.author.username + index}
                    image={message.author.profile_pic}
                    direction={
                      message?.author?.username === username ? "right" : "left"
                    }
                    content={message.content}
                    timestamp={message.timestamp}
                  />
                );
              })
            ) : (
              <p
                css={{
                  fontSize: "2rem",
                  marginTop: "10rem",
                  color: "var(--gray)",
                }}
              >
                No messages yet
                <RiMessageFill />
              </p>
            )}
          </div>
        </div>
        <InlineDiv background={`var(--${theme})`} aria-label="message box">
          <MessageInput
            onSubmit={handleSend}
            username={username}
            room_id={contact.room_id}
            submitEnabled={socketState === "Connected"}
            theme={theme}
            onUpload={(message) =>
              sendMessage(
                JSON.stringify({
                  command: "sendMessage",
                  message,
                })
              )
            }
          />
        </InlineDiv>
      </div>
    );
  }
};

export default ChatPanel;
