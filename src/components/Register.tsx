/**@jsxImportSource @emotion/react */
import React from "react";
import Joi from "joi-browser";
import { FaUserCircle, FaKey, FaAt, FaUserTag } from "react-icons/fa";
import { RiUserAddLine } from "react-icons/ri";
import MyForm from "./Form";
import { register } from "../services/authServices";
import { AiOutlineWoman } from "react-icons/ai";
import { toast } from "react-toastify";

const Register = ({ nextPage }) => {
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
    fullname: Joi.string()
      .required()
      .regex(/^[a-z]([-']?[a-z]+)*( [a-z]([-']?[a-z]+)*)+$/i)
      .error((errors) => {
        errors.forEach((err) => {
          if (err.type === "string.regex.base") {
            err.message =
              "Fullname should start with litters and must be seprated by a space e.g: 'Ahmad Ahmadi'";
          }
        });
        return errors;
      })
      .label("Fullname"),
    email: Joi.string().email().required().label("Email"),
    username: Joi.string().required().alphanum().min(4).label("Username"),
    password: Joi.string().required().min(4).label("Password"),
    confirm: Joi.string()
      .required()
      .valid(Joi.ref("password"))
      .options({
        language: {
          any: {
            allowOnly: "!!Passwords do not match",
          },
        },
      }),
    gender: Joi.string().required().min(1).max(2).label("Gender"),
  };

  const genderChoices = [
    ["M", "male"],
    ["F", "female"],
    ["NS", "notSpecified"],
  ];

  function WithStyle(Icon) {
    return (
      <Icon
        size="20px"
        css={{ transform: "translateX(1.6rem)", color: "white" }}
      />
    );
  }
  const footer = { caption: "Already have an account?", to: "login" };

  const structure = [
    { name: "fullname", icon: WithStyle(FaUserTag) },
    { name: "email", type: "email", icon: WithStyle(FaAt) },
    { name: "username", icon: WithStyle(FaUserCircle) },
    {
      name: "password",
      type: "password",
      icon: WithStyle(FaKey),
      props: { autoFocus: true },
    },
    { name: "confirm", type: "password", icon: WithStyle(FaKey) },
    {
      name: "gender",
      icon: WithStyle(AiOutlineWoman),
      type: "dropdown",
      content: genderChoices,
    },
  ];

  async function handleSubmit(validData) {
    setPending(true);
    try {
      const { success, message } = await register(validData);

      if (success) {
        nextPage(validData);
        toast.success(message);
      }
    } catch (error) {
      setPending(false);
      toast.error(error?.response?.data?.message || error?.message || 'Something went wrong please retry')
      return Promise.reject(error);
    }
  }

  return (
    <MyForm
      meta={{ title: "Register", icon: <RiUserAddLine /> }}
      structure={structure}
      styling={styles}
      fieldPerPage={3}
      schema={schema}
      onSubmit={handleSubmit}
      footer={footer}
      pending={pending}
    />
  );
};

export default Register;
