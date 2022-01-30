/**@jsxImportSource @emotion/react */
import Joi from "joi-browser";
import { FaUserCircle, FaKey } from "react-icons/fa";
import { SiGlassdoor } from "react-icons/si";
import Form from "./Form";
import { getCurrentUser, login } from "../services/authServices";
import { Navigate } from "react-router-dom";
import React from "react";
import "./styles/login.css";
const Login = () => {
  const user = getCurrentUser();
  const [error, setError] = React.useState("");
  const [pending, setPending] = React.useState(false);

  const styles = {
    border: "none",
    width: "fit-content",
    padding: "4rem 2rem",
    borderRadius: ".5rem",
    margin: "auto",
    backgroundColor: "rgb(2 69 121 / 63%)",
    boxShadow: "1px 1px 6px  #202020",
  };

  const schema = {
    username: Joi.string().required().label("Username"),
    password: Joi.string().required().min(4).label("Password"),
  };

  function WithStyle(Icon) {
    return (
      <Icon
        size="20px"
        css={{ transform: "translateX(1.6rem)", color: "white" }}
      />
    );
  }
  const footer = { caption: " Don't have an account?", to: "register" };

  const structure = [
    { name: "username", icon: WithStyle(FaUserCircle) },
    { name: "password", type: "password", icon: WithStyle(FaKey) },
  ];

  async function handleSubmit(data) {
    setPending(true);
    try {
      const { success } = await login(data);
      if (success) {
        window.location.replace("/profile");
      }
    } catch (err) {
      setError(err.message);
      setPending(false);
    }
  }

  return user ? (
    <Navigate to="/profile" />
  ) : (
    <Form
      meta={{ title: "Login", icon: <SiGlassdoor /> }}
      structure={structure}
      styling={styles}
      schema={schema}
      onSubmit={handleSubmit}
      footer={footer}
      submitError={error}
      pending={pending}
    />
  );
};

export default Login;
