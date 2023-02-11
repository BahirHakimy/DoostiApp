/**@jsxImportSource @emotion/react */
import React from "react";
import { Link } from "react-router-dom";
import { Div } from "./lib";

const NotFound = () => {
  return (
    <Div>
      <h4
        css={{
          fontWeight: "lighter",
          color: "orangered",
          width: "100%",
          margin: "auto",
        }}
      >
        Nothing here! click here to go to{" "}
        <Link to="/message">
          <code>Message Page</code>
        </Link>
      </h4>
    </Div>
  );
};

export default NotFound;
