/**@jsxImportSource @emotion/react */
import React from "react";
import { Sbutton, Spinner } from "../../lib";
import { AiOutlineHome, AiOutlinePlus } from "react-icons/ai";
import { useAsync } from "../../../services/utils";
import { axios } from "../../../services/client";
import { SearchBar, ErrorBox, AlertBox } from "../../Shared";
import "../../styles/chatRooms.css";
import { FaTimes, FaUsers, FaHome } from "react-icons/fa";

const Button = (props) => (
  <Sbutton
    styleOverrides={{
      background: props.dark ? "var(--blue)" : "var(--green)",
      boxShadow: ".1rem .1rem .3rem var(--dark)",
    }}
    {...props}
  />
);

const ChatRooms = ({ goToRoom, createRoom, theme }) => {
  const {
    run,
    data: rooms,
    setData,
    isIdle,
    isPending,
    isRejected,
    isSuccess,
    error,
    setError,
    reFetch,
  } = useAsync();

  const [state, setState] = React.useReducer((s, a) => ({ ...s, ...a }), {
    search: false,
    searching: false,
    create: false,
  });

  React.useEffect(() => {
    run(axios.get("rooms/list/", { baseURL: process.env.REACT_APP_ASGI_URL }));
  }, [run]);

  function handleSearch(value) {
    setState({ search: true, searching: true, create: false });
    axios
      .post(
        "rooms/search/",
        { search: value },
        { baseURL: process.env.REACT_APP_ASGI_URL }
      )
      .then(
        (response) => {
          setState({ searching: false });
          setData(response.data);
        },
        (error) =>
          setError({ message: error?.response?.message || error.message })
      );
  }
  function exitSearch() {
    setState({ search: false, searching: false });
    reFetch();
  }

  function handleCreateRoom(event) {
    event.preventDefault();
    const { nameInput, submitButton } = event.target.elements;
    submitButton.disabled = true;
    setTimeout(() => (submitButton.disabled = false), 3000);
    createRoom(nameInput.value);
  }

  function handleRoomSelect(roomName) {
    goToRoom(roomName);
  }

  if (isIdle || isPending) {
    return (
      <div aria-label="rooms-display" id="roomsParentContainer">
        <div id="roomsHeader" className={`roomsHeader-${theme}`}>
          <h4 css={{ color: "var(--light)" }}>Chat Rooms</h4>
          <SearchBar placeholder={"Search by room name"} onSubmit={() => {}} />
        </div>
        <div className="fullcenter" css={{ height: "80vh" }}>
          <Spinner
            size="30px"
            color={theme === "light" ? "var(--dark)" : "var(--light)"}
          />
        </div>
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
    return (
      <div aria-label="rooms-display" id="roomsParentContainer">
        <div id="roomsHeader" className={`roomsHeader-${theme}`}>
          <h4 css={{ color: "var(--light)" }}>Chat Rooms</h4>
          <SearchBar
            placeholder={"Search by room name"}
            onSubmit={handleSearch}
          />
        </div>

        {state.search && (
          <div id="roomsCloseButton" title="Exit search" onClick={exitSearch}>
            <FaTimes size="25px" />
          </div>
        )}
        {!state.create ? (
          <div id="roomsContainer">
            {!state.search && (
              <div
                className={`roomCard roomCard-${theme}`}
                onClick={() => setState({ create: true })}
              >
                <AiOutlinePlus className={`roomIcon-${theme}`} size="65px" />
                <br />
                <b className={`title-for${theme} roomName`}>Create</b>
              </div>
            )}
            {rooms.length > 0 && !state.searching ? (
              rooms.map((room) => (
                <div
                  className={`roomCard roomCard-${theme}`}
                  key={room.name}
                  onClick={() => handleRoomSelect(room.name)}
                >
                  <AiOutlineHome className={`roomIcon-${theme}`} size="65px" />
                  <p className={`title-for${theme} roomName`}>{room.name}</p>
                  <span
                    className={`roomMemebersCount members-${theme}`}
                    title="Room members"
                  >
                    <FaUsers style={{ paddingRight: ".3rem" }} size="18px" />
                    {"    "}
                    {room.members.length}
                  </span>
                </div>
              ))
            ) : !state.searching ? (
              <AlertBox
                error={rooms.message}
                styleOverrides={{
                  background: "var(--dark)",
                  borderRadius: ".5rem",
                }}
              />
            ) : (
              <Spinner size="20px" style={{ color: "var(--dark)" }} />
            )}
          </div>
        ) : (
          <div className="fullcenter" style={{ height: "85vh" }}>
            <form
              id="roomCreateForm"
              className={`roomForm-${theme}`}
              onSubmit={handleCreateRoom}
            >
              <div id="formHeader">Create Room</div>
              <div className="flex" style={{ paddingBottom: "1rem" }}>
                <FaHome size="50px" className="text-light" />
              </div>
              <input
                type="text"
                id="roomNameInput"
                name="nameInput"
                placeholder="Enter room name (30 chars)"
                maxLength="30"
                required
              />
              <div id="roomFormButtons">
                <Button
                  type="submit"
                  dark={theme === "dark"}
                  name="submitButton"
                >
                  Create
                </Button>
                <Button
                  dark={theme === "dark"}
                  onClick={() => setState({ create: false })}
                >
                  Cancel
                </Button>
              </div>
              {error && <div>{error.message}</div>}
            </form>
          </div>
        )}
      </div>
    );
  }
};

export default ChatRooms;
