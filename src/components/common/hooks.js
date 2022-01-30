import React from "react";
import { getCurrentUser } from "../../services/authServices";

const UserContext = React.createContext();

const UserProvider = (props) => {
  const user = getCurrentUser();
  let value;
  if (user) {
    value = { isAuth: true, ...user };
  } else {
    value = { isAuth: false };
  }
  return <UserContext.Provider value={value} {...props} />;
};

function useUser() {
  const data = React.useContext(UserContext);
  if (!data) {
    throw new Error("useUser hook must be within a UserProvider component!");
  }
  return data;
}

const ThemeContext = React.createContext("dark");

const ThemeProvider = (props) => {
  const setTheme = (color) => localStorage.setItem("theme", color);
  const getTheme = React.useCallback(
    () =>
      localStorage.getItem("theme") !== "undefined"
        ? localStorage.getItem("theme")
        : null,
    []
  );
  const [currentTheme, setCurrentTheme] = React.useState(getTheme() || "dark");

  React.useEffect(() => {
    if (getTheme() !== currentTheme) {
      setTheme(currentTheme);
    }
  }, [currentTheme, getTheme]);

  return (
    <ThemeContext.Provider
      value={{ currentTheme, setCurrentTheme }}
      {...props}
    />
  );
};
function useTheme() {
  const context = React.useContext(ThemeContext);
  if (!context)
    throw new Error("useTheme must be called within a ThemeProvider");
  return context;
}

export { UserProvider, useUser, UserContext, ThemeProvider, useTheme };
