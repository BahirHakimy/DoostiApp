import React from "react";
import { Spinner } from "../../lib";
import { axios } from "../../../services/client";
import { useAsync } from "../../../services/utils";
import { ErrorBox, FriendCard } from "../../Shared";

const FriendDisplayList = ({ username, onSelect, reRender, theme }) => {
  const { data, error, run, isPending, isRejected, isIdle, isSuccess } =
    useAsync({ data: [] });

  React.useEffect(() => {
    run(axios.post("friends/", { username }));
  }, [reRender, run, username]);

  if (isPending || isIdle) {
    return (
      <div className="fullcenter">
        <Spinner size="30px" />
      </div>
    );
  }

  if (isRejected) {
    return (
      <div className="fullcenter">
        <ErrorBox error={error?.response?.data.message || error?.message} />
      </div>
    );
  }

  if (isSuccess) {
    const { friends } = data;
    return (
      <div id="friendDisplayScreen">
        <h3 className={`title-for${theme}`}>Your Friends</h3>
        {friends.length > 0 ? (
          <div className="friendsDisplayContainer">
            {friends?.map((friend) => (
              <FriendCard
                key={friend?.username}
                profile={friend}
                onClick={onSelect}
                theme={theme}
              />
            ))}
          </div>
        ) : (
          <div id="friendDisplayContainer" className={`title-for${theme}`}>
            You don't have any friends yet, Try sending some friend requests
          </div>
        )}
      </div>
    );
  }
};

export default FriendDisplayList;
