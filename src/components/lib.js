/**@jsxImportSource @emotion/react */

import { keyframes } from "@emotion/react";
import styled from "@emotion/styled";
import { AiOutlineLoading } from "react-icons/ai";
import { FaSpinner } from "react-icons/fa";
import { colors } from "./styles/colors";

const spin = keyframes({
  "0%": { transform: "rotate(0deg)" },
  "100%": { transform: "rotate(360deg)" },
});

const Spinner = styled(FaSpinner)({
  color: "white",
  animation: `${spin} 1s linear infinite`,
});

const LoadingSpinner = styled(AiOutlineLoading)({
  animation: `${spin} .5s linear infinite`,
});

Spinner.defaultProps = {
  "aria-label": "loading",
};

const ProfileSize = {
  small: {
    width: "40px",
    height: "40px",
  },
  medium: {
    width: "10rem",
    height: "10rem",
  },
  big: {
    width: "15rem",
    height: "15rem",
  },
};

const ProfileImage = styled.img(({ styleOverrides, size }) => ({
  width: "40px",
  height: "40px",
  borderRadius: "50%",
  backgroundColor: "gray",
  margin: "1rem 0",
  transition: "filter .5s",
  ...ProfileSize[size],
  ...styleOverrides,
}));

const Form = styled.form(({ styleOverrides }) => ({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  flexDirection: "column",
  ...styleOverrides,
}));

const iconStyles = {
  margin: ".5rem 0",
  display: "block",
  color: colors.dark,
  ":hover": {
    background: "rgba(220,220,200,0.5)",
    boxShadow: ".05rem 0 .5rem .05rem #333",
    borderRadius: ".2rem",
  },
  padding: "1rem .9rem",
};

const directions = {
  left: {
    left: "1.5rem",
    borderRadius: "3px 40px 40px 40px",
    background: "var(--olive-green)",
  },
  right: {
    right: "1.5rem",
    borderRadius: "40px 40px 0px 40px",
    background: "var(--cyan)",
  },
};

const Input = styled.input({
  width: "45rem",
  padding: "1rem",
  fontSize: "1rem",
  outline: "none",
  margin: ".4rem 1rem",
  border: "none",
  boxShadow: "1px 1px 5px inset gray",
  borderRadius: ".2rem",
});

const FormInput = styled.input({
  outline: "none",
  background: "transparent",
  fontSize: "1rem",
  padding: ".4rem 2rem",
  border: "none",
  borderBottom: "2px solid #eee",
  color: "white",
  "::placeholder": {
    color: "white",
  },
  ":focus": {
    "::placeholder": {
      color: "transparent",
    },
  },
});

const InputGroup = styled.div({
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-evenly",
  alignItems: "center",
});

const Button = styled.button({
  margin: "auto .2rem",
  padding: ".5rem 1.2rem",
  borderRadius: ".5rem",
  lineHeight: "1rem",
  outline: "none",
  border: "none",
  background: "#01477a",
  boxShadow: ".1rem .1rem .2rem #aaa",
  color: "white",
  marginTop: "1rem",
  fontSize: "1rem",
  cursor: "pointer",
  ":hover": {
    boxShadow: ".1rem .1rem .2rem #fff",
  },
  ":active": {
    boxShadow: "inset -.1rem -.1rem .2rem #ccc",
  },
});

const toggle = keyframes({
  from: {
    transform: "scale(.5)",
  },
  to: {
    transform: "scale(1)",
  },
});

const MessageBlock = styled.div((props) => ({
  position: "relative",
  padding: ".2rem 2rem",
  background: "linear-gradient(45deg,lightblue,blanchedalmond)",
  boxShadow: "inset 0px 0px 5px 1px #333a",
  maxWidth: "70%",
  color: "var(--light)",
  animation: `${toggle} .5s ease-out 1`,
  ...directions[props.direction],
}));

const ListItem = styled.li(({ border = false, hover = false }) => ({
  display: "flex",
  alignItems: "center",
  padding: "0 1rem",
  margin: "0",
  flexDirection: "row",
  justifyContent: "space-between",
  borderBottom: border === true ? "1px solid #999" : "",
  userSelect: "none",
  ":hover": hover
    ? {
        background: "#3333",
      }
    : null,
}));

const InlineDiv = styled.div(({ background }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-start",
  background: background || "whiteSmoke",
  borderTop: "1px solid var(--gray)",
  borderRadius: ".4rem",
}));
const Div = styled.div(({ styleOverrides }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-start",
  flexDirection: "row",
  marginTop: "-2rem",
  borderBottom: "1px solid #eee",
  borderRadius: ".5rem",
  ...styleOverrides,
}));

const WrapperDiv = styled.div(({ styleOverrides }) => ({
  display: "flex",
  flexDirection: "row",
  justifyContent: "space-evenly",
  alignItems: "center",
  ...styleOverrides,
}));

const Sbutton = styled.button(({ background, styleOverrides }) => ({
  padding: "0.5rem 1rem",
  borderRadius: "0.5rem",
  color: "white",
  border: "none",
  fontSize: "1rem",
  margin: "0 .5rem",
  fontWeight: "lighter",
  boxShadow: "0.1rem 0.1rem 0.3rem 0.1rem #ccc",
  marginTop: "1rem",
  ":hover": {
    boxShadow: "0.2rem 0.2rem 0.4rem 0.1rem #333",
  },
  ":active": {
    boxShadow: "inset 0.2rem 0.2rem 0.4rem 0.1rem #333",
  },
  ":disabled": {
    background: "#669dd8",
  },
  background: background || colors.primary,
  ...styleOverrides,
}));
const Tag = styled.span(({ styleOverrides }) => ({
  padding: "0.5rem 1rem",
  borderRadius: "0.5rem",
  color: colors.cyan,
  border: "none",
  fontSize: "1rem",
  fontWeight: "lighter",
  boxShadow: "0.1rem 0.1rem 0.3rem 0.1rem #ccc",
  marginTop: "1rem",
  ...styleOverrides,
}));

const AudioBlock = styled.div(({ direction, styleOverrides }) => ({
  display: "flex",
  padding: ".5rem",
  margin: "0 1.5rem",
  background: direction === "right" ? "var(--cyan)" : "var(--olive-green)",
  borderRadius:
    direction === "right" ? "2rem 2rem 0 2rem" : "0rem 2rem 2rem 2rem",
  boxShadow: "inset .1rem .1rem .3rem var(--dark)",
}));

//

export {
  MessageBlock,
  Input,
  FormInput,
  InputGroup,
  ProfileImage,
  iconStyles,
  ListItem,
  InlineDiv,
  Div,
  Form,
  Button,
  Sbutton,
  Tag,
  WrapperDiv,
  Spinner,
  LoadingSpinner,
  AudioBlock,
};
