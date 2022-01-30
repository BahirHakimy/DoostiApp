import React from "react";
import { BiArrowFromLeft, BiArrowFromRight, BiUserPin } from "react-icons/bi";
import { toast } from "react-toastify";
import { axios } from "../../../services/client";
import { useAsync } from "../../../services/utils";
import { Sbutton as Button, ProfileImage, Spinner } from "../../lib";
import { colors } from "../../styles/colors";

const RequestsAndNotifications = ({
  username,
  onProfileClick,
  updateTrigger,
  theme,
}) => {
  const [state, setState] = React.useReducer((s, a) => ({ ...s, ...a }), {
    isVisible: false,
    pendingIndex: -1,
  });
  const ref = React.useRef();

  const {
    data: requests,
    error,
    run,
    setData,
    isPending,
    isRejected,
  } = useAsync({ data: [] });

  React.useEffect(() => {
    run(axios.post("friends/requests/", { username }));
  }, [run, username]);

  function handleClick() {
    if (state.isVisible) {
      hide();
      setState({ isVisible: false });
    } else {
      show();
      setState({ isVisible: true });
    }
  }
  function show() {
    ref.current.style.right = "0rem";
  }
  function hide() {
    ref.current.style.right = "-21rem";
  }

  function handleRequest(operation, pIndex, friend) {
    setState({ pendingIndex: pIndex });
    axios
      .post("friends/requests-operation/", {
        username,
        friend,
        operation,
      })
      .then(
        (response) => {
          setData(requests.filter((req) => req.sender.username !== friend));
          toast.info(response?.data.message);
          if (operation === "accept") {
            updateTrigger(Math.random());
          }
          setState({ pendingIndex: -1 });
        },
        (err) => {
          toast.error(err.message);
          setState({ pendingIndex: -1 });
        }
      );
  }

  function handleGoToProfile(friend) {
    onProfileClick({ user: friend });
    hide();
    setState({ isVisible: false });
  }

  return (
    <div ref={ref} id="togglableSection">
      <div
        className="sideNav"
        style={theme === "dark" ? { background: "var(--lightIndiago)" } : {}}
      >
        <div className="iconSet" onClick={handleClick}>
          <BiUserPin
            className={state.isVisible ? "navIcon iconActive" : "navIcon"}
          />
          {requests?.length > 0 && <span className="tag">∙</span>}
        </div>
        <div>
          {state.isVisible ? (
            <BiArrowFromLeft
              title="Close"
              onClick={handleClick}
              className="navIcon"
            />
          ) : (
            <BiArrowFromRight
              title="Open"
              onClick={handleClick}
              className="navIcon"
            />
          )}
        </div>
      </div>
      <div
        className="sideNavContainer"
        style={
          theme === "dark" ? { background: "var(--gradient-darkIndiago)" } : {}
        }
      >
        {isRejected ? (
          <ul id="requestsList">
            <li className="requestsListTitle">Error</li>
            <li className="error">{error?.response?.data.message}</li>
          </ul>
        ) : (
          <ul id="requestsList">
            <li className="requestsListTitle">
              {isPending && <Spinner />}
              FriendReqests
            </li>
            {requests?.length > 0 ? (
              <>
                {requests.map(({ sender }, index) => (
                  <li key={sender?.username} className="requestListItem">
                    <div className="requestListItemBio">
                      <ProfileImage
                        size="small"
                        src={sender?.profile_pic}
                        styleOverrides={{ margin: "0 .2rem 0 1rem" }}
                      />
                      <p className="requestListItemName">
                        {sender.fullname}
                        <span className="requestListItemCaption">
                          sent you a request
                        </span>
                      </p>
                    </div>
                    <div>
                      <Button
                        background={colors.light}
                        styleOverrides={{
                          color: colors.dark,
                          margin: "0 .2rem .5rem ",
                          boxShadow: `0.1rem 0.1rem 0.3rem 0.1rem var(--${theme})`,
                        }}
                        onClick={() => handleGoToProfile(sender)}
                      >
                        Profile
                      </Button>
                      <Button
                        background={colors.info}
                        styleOverrides={{
                          margin: "0 .2rem .5rem ",
                          boxShadow: `0.1rem 0.1rem 0.3rem 0.1rem var(--${theme})`,
                        }}
                        onClick={() =>
                          handleRequest("accept", index, sender.username)
                        }
                      >
                        Accept
                      </Button>
                      <Button
                        background={colors.danger}
                        styleOverrides={{
                          margin: "0 .2rem .5rem ",
                          boxShadow: `0.1rem 0.1rem 0.3rem 0.1rem var(--${theme})`,
                        }}
                        onClick={() =>
                          handleRequest("delete", index, sender.username)
                        }
                      >
                        Delete
                      </Button>
                    </div>
                  </li>
                ))}
              </>
            ) : (
              <li className="notificationText">No Requests</li>
            )}
          </ul>
        )}
      </div>
    </div>
  );
};

export default RequestsAndNotifications;
