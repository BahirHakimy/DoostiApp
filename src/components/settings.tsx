/**@jsxImportSource @emotion/react */
import React from "react";
import { FaInfoCircle, FaPaintBrush, FaUserLock } from "react-icons/fa";
import { useTheme } from "./common/hooks";
import Appearance from "./screens/settings/appearance";
import Account from "./screens/settings/account";
import "./styles/settings.css";
import AboutUs from "./screens/settings/aboutUs";

function Setting(props) {
  const { currentTheme, setCurrentTheme } = useTheme();
  const [currentMenu, setCurrentMenu] = React.useState(0);

  function handleThemeChange() {
    setCurrentTheme((theme) => (theme === "light" ? "dark" : "light"));
  }

  const menus = [
    ["Appearence", <FaPaintBrush />],
    ["Account", <FaUserLock />],
    ["About", <FaInfoCircle />],
  ];
  return (
    <div className={`settingParentContainer theme-${currentTheme}`}>
      <ul id="settingsSideList" className={`sideList-${currentTheme}`}>
        <h4 className={`title-for${currentTheme}`}>Categories</h4>
        {menus.map((menu, index) => (
          <li
            key={menu[0]}
            onClick={() => setCurrentMenu(index)}
            className={`listItem list-${currentTheme} ${
              currentMenu === index && "list-active"
            }`}
          >
            {menu[1]}
            {menu[0]}
          </li>
        ))}
      </ul>
      {currentMenu === 0 ? (
        <Appearance theme={currentTheme} onThemeChange={handleThemeChange} />
      ) : currentMenu === 1 ? (
        <Account theme={currentTheme} />
      ) : (
        <AboutUs theme={currentTheme} />
      )}
    </div>
  );
}

export default Setting;
