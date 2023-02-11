import React from "react";
import { BiMessageRounded, BiUserX } from "react-icons/bi";
import { FaClock, FaUserCheck, FaUserClock, FaUserPlus } from "react-icons/fa";
import { RiUserUnfollowFill } from "react-icons/ri";
import { toast } from "react-toastify";
import { axios } from "../../../services/client";
import { useAsync } from "../../../services/utils";
import { ErrorBox } from "../../Shared";
import { ProfileImage, Spinner, Sbutton as Button, Tag } from "../../lib";
import { getAge } from "../../profile";
import { colors } from "../../styles/colors";
import { capitalize } from "lodash";
import { useNavigate } from "react-router-dom";

const FriendsProfile = ({
  theme,
  username,
  currentUser,
  onClose,
  onMessageClick,
}) => {
  const {
    run,
    error,
    data: profile,
    setData,
    isIdle,
    isSuccess,
    isPending,
    isRejected,
  } = useAsync();

  const navigate = useNavigate();
  const [pendingState, setPendingState] = React.useState("none");

  React.useEffect(() => {
    if (!username) return;
    run(axios.post("users/user/", { username, currentUser }));
  }, [username, run, currentUser]);

  function handleRequest(operation, successState) {
    setPendingState(operation);
    axios
      .post("friends/requests-operation/", {
        username: currentUser,
        friend: username,
        operation,
      })
      .then(
        (response) => {
          setData({ ...profile, friendship_state: successState });
          toast.info(response?.data.message);
          setPendingState("none");
        },
        (err) => {
          toast.error(err.message);
          setPendingState("none");
        }
      );
  }

  function sendRequest() {
    handleRequest("add", "pending");
  }

  function cancelRequest() {
    handleRequest("cancel", "idle");
  }

  function acceptRequest() {
    handleRequest("accept", "success");
  }

  function deleteRequest() {
    handleRequest("delete", "idle");
  }

  function gotoMessage() {
    onMessageClick(username);
    navigate('/message');
    setTimeout(() => onMessageClick(null), 1500);
  }

  function unFriend() {
    handleRequest("unFriend", "idle");
  }

  if (isPending || isIdle) {
    return (
      <div className="fullcenter">
        <Spinner
          size="30px"
          css={{
            color: theme === "light" ? "var(--dark)" : "var(--light)",
          }}
        />
      </div>
    );
  }
  if (isRejected && error) {
    return (
      <div className="fullcenter">
        <ErrorBox error={error?.message} />
      </div>
    );
  }

  function getButton(state) {
    switch (state) {
      case "success":
        return (
          <>
            <Button background={colors.info} onClick={gotoMessage}>
              <BiMessageRounded /> Message
              {"  "}
              {pendingState === "message" && <Spinner />}
            </Button>
            {"    "}
            <Button background={colors.danger} onClick={unFriend}>
              <RiUserUnfollowFill /> Unfriend
              {"  "}
              {pendingState === "unFriend" && <Spinner />}
            </Button>
          </>
        );
      case "pending":
        return (
          <Button background={colors.warning} onClick={cancelRequest}>
            <BiUserX /> Cancel Request
            {"  "}
            {pendingState === "cancel" && <Spinner />}
          </Button>
        );
      case "waiting":
        return (
          <div>
            <Button
              background={colors.info}
              styleOverrides={{ margin: "0 .2rem .5rem " }}
              onClick={acceptRequest}
            >
              Accept
              {"  "}
              {pendingState === "accept" && <Spinner />}
            </Button>
            {"    "}
            <Button
              background={colors.danger}
              styleOverrides={{ margin: "0 .2rem .5rem " }}
              onClick={deleteRequest}
            >
              Delete
              {"  "}
              {pendingState === "delete" && <Spinner />}
            </Button>
          </div>
        );
      case "idle":
        return (
          <Button background={colors.info} onClick={sendRequest}>
            <FaUserPlus /> Add friend
            {"  "}
            {pendingState === "add" && <Spinner />}
          </Button>
        );

      default:
        break;
    }
  }
  function getSpan(state) {
    switch (state) {
      case "success":
        return (
          <Tag>
            <FaUserCheck /> Friends
          </Tag>
        );
      case "pending":
        return (
          <Tag>
            <FaUserClock /> Request sent
          </Tag>
        );
      case "waiting":
        return (
          <Tag>
            <FaClock /> Pending
          </Tag>
        );
      default:
        break;
    }
  }

  if (isSuccess) {
    return (
      <div id="friendProfileScreenContainer">
        <button id="closeButton" title="Close" onClick={() => onClose(null)}>
          X
        </button>
        <div className="profileImageContainer">
          <img src={profile.cover_photo} alt="coverPhoto" id="coverPhoto" />
          <ProfileImage
            src={profile.profile_pic}
            styleOverrides={{
              boxShadow: ".2rem .2rem .7rem .1rem #777",
              zIndex: "100",
            }}
            size="big"
          />
          <h3 className="name">{profile.fullname}</h3>
        </div>
        <div id="infoAndControls">
          <div className={`info title-for${theme}`}>
            <p>Age: {getAge(profile.date_of_birth)} Years old</p>
            <p>
              Lives at:{" "}
              {`${capitalize(profile.city)} / ${capitalize(profile.country)}`}
            </p>
            <p>Works at: {profile.workplace}</p>
          </div>
          {getSpan(profile.friendship_state)}
          <div aria-label="buttons">{getButton(profile.friendship_state)}</div>
        </div>
      </div>
    );
  }
};

export default FriendsProfile;
