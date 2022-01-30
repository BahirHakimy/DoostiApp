/** @jsxImportSource @emotion/react */
import React from "react";
import {
  FaArrowCircleRight,
  FaEye,
  FaEyeSlash,
  FaFileDownload,
  FaHome,
  FaSearch,
} from "react-icons/fa";
import { formatDate } from "./profile";
import {
  AiOutlineSetting,
  AiOutlinePoweroff,
  AiOutlineKey,
  AiOutlineUserAdd,
  AiFillWarning,
  AiOutlineDisconnect,
} from "react-icons/ai";
import { Form, FormInput, WrapperDiv } from "./lib";
import { RiMessage3Line } from "react-icons/ri";
import { FaUserFriends } from "react-icons/fa";
import {
  ProfileImage,
  iconStyles,
  MessageBlock,
  ListItem,
  AudioBlock,
} from "./lib";
import { logout } from "../services/authServices";
import { Link, useLocation } from "react-router-dom";
import { toast } from "react-toastify";

function FileSymbol({ name, link }) {
  return (
    <a
      href={link}
      download={name.split(":")[1]}
      css={{
        textDecoration: "none",
        background: "transparent",
        height: "2.5rem",
        width: "2.5rem",
        position: "relative",
      }}
    >
      <FaFileDownload
        size="30px"
        css={{
          color: "var(--dark)",
          padding: ".2rem",
          borderRadius: ".5rem",
          background: "#3334",
        }}
      />
    </a>
  );
}

function MessageContainer({
  fullname,
  image,
  content,
  direction,
  timestamp,
  file = null,
}) {
  const timestampStyle = {
    margin: "auto 3rem",
    color: "var(--olive-green)",
    textShadow: ".1rem .1rem .3rem var(--dark)",
    fontSize: ".8rem",
    width: "6rem",
  };

  const weekDays = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  function formatTimestamp(timeString) {
    const date = new Date(timeString);
    const [month, day] = formatDate(date).split(" ");
    const diff = new Date().getDate() - date.getDate();
    const dayName = () => {
      switch (diff) {
        case 0:
          return "Today";
        case 1:
          return "Yesterday";
        default:
          return weekDays[date.getDay()];
      }
    };
    function formatClock() {
      let hour = "";
      let id = "";
      const minutes = date.getMinutes();
      const seconds = date.getSeconds();
      if (date.getHours() > 12) {
        hour = date.getHours() - 12;
        id = "PM";
      } else {
        hour = date.getHours();
        id = "AM";
      }
      return `${hour}:${minutes > 9 ? minutes : `0${minutes}`}:${
        seconds > 9 ? seconds : `0${seconds}`
      } ${id}`;
    }
    return diff > 1
      ? `${dayName()} ${day} ${month}  ${formatClock()}`
      : `${dayName()} at ${formatClock()}`;
  }

  return (
    <div
      css={{
        display: "flex",
        flexDirection: "row",
        alignItems: direction === "left" ? "baseline" : "flex-end",
        justifyContent: direction === "left" ? "flex-start" : "flex-end",
        margin: ".8rem 0",
      }}
    >
      {direction === "left" && (
        <ProfileImage
          title={fullname && fullname}
          css={{ margin: "0" }}
          src={image}
          alt="profile"
        />
      )}
      {direction === "right" && (
        <p css={{ ...timestampStyle }}>{formatTimestamp(timestamp)}</p>
      )}
      {file && content.endsWith(".wav") ? (
        <AudioBlock direction={direction}>
          <audio src={file} controls preload="auto" />
        </AudioBlock>
      ) : (
        <MessageBlock direction={direction}>
          <p
            css={{
              textAlign: direction,
              fontWeight: "300",
              userSelect: "none",
            }}
          >
            {file ? (
              <>
                <FileSymbol name={content} link={file} />
                {content}
              </>
            ) : (
              content
            )}
          </p>
        </MessageBlock>
      )}
      {direction === "left" && (
        <p css={{ ...timestampStyle }}>{formatTimestamp(timestamp)}</p>
      )}
      {direction === "right" && (
        <ProfileImage
          title={fullname && fullname}
          css={{ margin: "0" }}
          src={image}
          alt="profile"
        />
      )}
    </div>
  );
}

function FriendListItem({
  username,
  name,
  img,
  room = false,
  tag,
  styles,
  onSelect,
}) {
  return (
    <ListItem hover={true} onClick={() => onSelect(username)}>
      <div
        css={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "start",
          alignItems: "center",
          color: "#fff",
        }}
      >
        {room ? (
          <FaHome
            size="25px"
            css={{
              color: "var(--light)",
              borderRadius: "50%",
              background: "var(--lightIndiago)",
              padding: "0.5rem",
              border: "1px solid var(--darkIndiago)",
            }}
          />
        ) : (
          <ProfileImage css={styles} src={img} alt="profile" />
        )}
        <h5 css={{ marginLeft: "10px" }}>{name}</h5>
      </div>
      {tag > 0 && (
        <span
          css={{
            color: "white",
            background: "#005ae275",
            padding: "0.1rem .4rem",
            borderRadius: ".8rem",
          }}
        >
          {tag}
        </span>
      )}
    </ListItem>
  );
}

const FriendCard = ({ profile, onClick, theme }) => {
  return (
    <div
      css={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-evenly",
        background:
          theme === "dark" ? "var(--gradient-darkIndiago)" : "var(--light)",
        height: "20rem",
        width: "15rem",
        borderRadius: ".5rem",
        alignItems: "center",
        position: "relative",
        margin: "1rem",
      }}
    >
      <ProfileImage
        src={profile.profile_pic}
        alt="profile"
        size="medium"
        styleOverrides={{
          boxShadow: "0.2rem 0.2rem 0.6rem 0.1rem #333",
          zIndex: "1",
        }}
      />
      <div
        css={{
          position: "absolute",
          background: "linear-gradient(90deg, #4ac35e, #36f4f4,transparent)",
          height: "11rem",
          width: "6rem",
          left: "2.9rem",
          top: "0.8rem",
          borderTopLeftRadius: "8.5rem",
          borderBottomLeftRadius: "8.5rem",
          transform: "translateX(-12px)",
        }}
      ></div>
      <h3 className={`title-for${theme}`}>{profile.fullname}</h3>
      <button
        className="button2"
        onClick={() => onClick({ user: { username: profile.username } })}
      >
        View Profile
      </button>
    </div>
  );
};

const Navbar = (props) => {
  const location = useLocation();
  const path = location?.pathname.substr(1);
  const { isAuth, photo, dark } = props;

  let newStyles = dark ? { ...iconStyles, color: "var(--light)" } : iconStyles;
  return isAuth ? (
    <nav
      css={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        background: dark ? "var(--gradient-dark)" : "var(--gradient-light)",
      }}
    >
      <div
        css={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "flex-end",
        }}
      >
        <Link to="profile">
          <ProfileImage
            title="Profile"
            alt="profile-icon"
            src={photo || "assets/default/userMale128.png"}
            className={path === "profile" ? "navActive" : ""}
          />
        </Link>
        <Link to="/message">
          <RiMessage3Line
            title="Messages"
            css={newStyles}
            size="25px"
            className={path === "message" ? "navActive" : ""}
          />
        </Link>
        <Link to="/friends">
          <FaUserFriends
            title="Friends"
            css={newStyles}
            size="25px"
            className={path === "friends" ? "navActive" : ""}
          />
        </Link>
        <Link to="/settings">
          <AiOutlineSetting
            title="Settings"
            css={newStyles}
            size="25px"
            className={path === "settings" ? "navActive" : ""}
          />
        </Link>
        {/* <RiMoreLine title="Options" css={newStyles} size="25px" /> */}
      </div>
      <div
        css={{
          width: "100%",
          height: "50vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "flex-end",
        }}
      >
        <AiOutlinePoweroff
          title="Logout"
          onClick={() => {
            const confirm = window.confirm(
              "You are about to logout, Are you sure?"
            );
            confirm && logout();
          }}
          css={newStyles}
          size="25px"
        />
      </div>
    </nav>
  ) : (
    <nav
      css={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        background: "linear-gradient(lightblue,blanchedalmond)",
      }}
    >
      <Link to="/login">
        <AiOutlineKey
          title="Login"
          css={iconStyles}
          size="25px"
          className={path === "login" ? "navActive" : ""}
        />
      </Link>
      <Link to="/register">
        <AiOutlineUserAdd
          title="Regitser"
          css={iconStyles}
          size="25px"
          className={path === "register" ? "navActive" : ""}
        />
      </Link>
    </nav>
  );
};

function ToggleButton({ on = false, callback }) {
  function handleClick() {
    callback();
  }
  return (
    <div
      id="ToggleButtonShell"
      css={{
        position: "relative",
        background: on ? "var(--light)" : "var(--primary)",
        height: "2rem",
        width: "4rem",
        borderRadius: "1rem",
        transition: "background .5s",
      }}
      onClick={handleClick}
    >
      <div
        id="ToggleButtonBall"
        css={{
          position: "absolute",
          top: ".2rem",
          left: on ? "2.2rem" : ".2rem",
          background: on ? "var(--yellow)" : "var(--light)",
          borderRadius: "50%",
          height: "1.6rem",
          width: "1.6rem",
          transition: "all .5s",
        }}
      ></div>
    </div>
  );
}

function AlertBox({ error, styleOverrides, iconColor = "white" }) {
  return error ? (
    <div
      role="alert"
      css={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        color: "orange",
        fontWeight: "lighter",
        width: "16rem",
        paddingTop: ".4rem",
        height: "2rem",
        fontSize: ".8rem",
        ...styleOverrides,
      }}
    >
      <AiFillWarning size="20px" css={{ color: iconColor }} />
      <p>{error}</p>
    </div>
  ) : (
    <></>
  );
}
function ErrorBox({ error, icon: Icon = null }) {
  return error ? (
    <div
      role="alert"
      css={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        background: "red",
        color: "white",
        fontFamily: "monospace",
        borderRadius: ".5rem",
        boxShadow: ".3rem .3rem .5rem .1rem orange",
        padding: ".2rem 1rem",
        fontWeight: "normal",
        paddingTop: ".4rem",
        fontSize: "1.4rem",
      }}
    >
      <AiFillWarning
        size="30px"
        css={{ color: "orange", marginRight: ".5rem" }}
      />
      <p>{error}</p>
      {Icon && <Icon size="30px" css={{ color: "var(--warning)" }} />}
      {error === "No Connection" && (
        <AiOutlineDisconnect size="30px" css={{ color: "var(--warning)" }} />
      )}
    </div>
  ) : (
    <></>
  );
}

function FileChooser({
  refrence,
  allowedTypes = ["image/jpeg", "image/png"],
  onSelect,
  onError = () => {},
  maxSize = 5,
  sizeWarning = null,
  typeWarningPrompt = null,
}) {
  const allowedSize = maxSize * 1024 * 1024;
  const accept = allowedTypes.join(",");
  function handleFileSelect(e) {
    const file = e.target.files[0];
    if (allowedTypes.length > 1) {
      if (allowedTypes.indexOf(file.type) !== -1) {
        if (file.size > allowedSize) {
          toast.warn(
            sizeWarning || `The file cant be more than ${maxSize} MBs!`
          );
          onError();
        } else {
          onSelect(URL.createObjectURL(file));
        }
      } else {
        toast.warn(typeWarningPrompt || "The selected file is not allowed!");
        onError();
      }
    } else {
      if (file.size > allowedSize) {
        toast.warn(sizeWarning || "The file cant be more than 5 MBs!");
        onError();
      } else {
        onSelect(file);
      }
    }
  }
  return (
    <input
      ref={refrence}
      style={{ display: "none" }}
      type="file"
      accept={accept}
      onChange={handleFileSelect}
    />
  );
}

function ProgressBar({ show, percent = 10 }) {
  return (
    <div
      css={{
        height: "2rem",
        width: "40rem",
        marginTop: "1rem",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {show && (
        <>
          <p css={{ color: "var(--dark)", margin: "0 1rem 0 0" }}>
            Uploading:{" "}
          </p>

          <div
            css={{
              width: "100%",
              border: "1px solid var(--primary)",
              borderRadius: ".3rem",
              boxShadow: ".1rem .1rem .3rem var(--dark)",
            }}
          >
            <div
              css={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                maxWidth: "100%",
                width: `${percent}%`,
                background: "var(--info)",
                height: "2rem",
                borderRadius: "0.2rem",
                transition: "width .3s",
              }}
            >
              <p
                css={{
                  color: "var(--light)",
                  margin: "0 0 0 2rem",
                  textShadow: ".1rem .1rem .3rem var(--dark)",
                }}
              >
                {percent}%
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
const SearchBar = ({ onSubmit, placeholder, styleOverrides = {} }) => {
  return (
    <div>
      <Form
        onSubmit={(event) => {
          event.preventDefault();
          onSubmit(event.target.elements["search"].value);
        }}
        styleOverrides={{
          justifyContent: "space-around",
          ...styleOverrides,
        }}
      >
        <WrapperDiv styleOverrides={{ position: "relative" }}>
          <label htmlFor="search">
            <FaSearch id="searchFormLabel" />
          </label>
          <FormInput
            required={true}
            id="search"
            name="search"
            type="search"
            placeholder={placeholder}
          />
          <label htmlFor="hiddenSubmit">
            <FaArrowCircleRight id="submitArrow" />
          </label>
          <input type="submit" id="hiddenSubmit" />
        </WrapperDiv>
      </Form>
    </div>
  );
};

function PasswordField(props) {
  const [visible, setVisible] = React.useState(false);
  return (
    <>
      <input type={visible ? "text" : "password"} required {...props} />
      {visible ? (
        <FaEyeSlash
          color="var(--dark)"
          onClick={() => setVisible(false)}
          className="visibalityToggle"
        />
      ) : (
        <FaEye
          color="var(--dark)"
          onClick={() => setVisible(true)}
          className="visibalityToggle"
        />
      )}
    </>
  );
}

export {
  MessageContainer,
  Navbar,
  FriendListItem,
  FriendCard,
  AlertBox,
  ErrorBox,
  FileChooser,
  ProgressBar,
  SearchBar,
  FileSymbol,
  ToggleButton,
  PasswordField,
};
