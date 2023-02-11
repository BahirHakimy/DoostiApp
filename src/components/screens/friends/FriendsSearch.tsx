import { axios } from "../../../services/client";
import React from "react";
import { useAsync } from "../../../services/utils";
import { FriendListItem, SearchBar } from "../../Shared";
import { Spinner } from "../../lib";

const FriendsSearch = ({ currentUser, onSelect, theme }) => {
  const [search, setSearch] = React.useState("");
  const { run, data, error, isIdle, isPending, isRejected } = useAsync({
    data: [],
  });

  React.useEffect(() => {
    if (search === "") return;
    run(axios.post("users/search/", { search, currentUser }));
  }, [currentUser, run, search]);

  return (
    <div>
      <div id="searchFormContainer">
        <SearchBar
          onSubmit={(value) => setSearch(value)}
          placeholder="Search Users"
          styleOverrides={{ margin: "1rem 0" }}
        />
      </div>
      <div className="friendsList">
        {isRejected && error ? (
          <p className="error">{error.response?.data.message}</p>
        ) : isPending ? (
          <Spinner size="25px" />
        ) : (
          <ul id="mySideList">
            {data.length > 0 ? (
              data.map((profile) => (
                <div
                  key={profile.user.username}
                  className="friendListContainer"
                >
                  <FriendListItem
                    username={profile}
                    img={profile.profile_pic}
                    name={profile.fullname}
                    styles={{ margin: ".2rem 0" }}
                    onSelect={onSelect}
                  />
                </div>
              ))
            ) : isIdle ? (
              <li className="notificationText">Find new friends</li>
            ) : (
              <li className={`title-for${theme}`}>No Users Found!</li>
            )}
          </ul>
        )}
      </div>
    </div>
  );
};

export default FriendsSearch;
