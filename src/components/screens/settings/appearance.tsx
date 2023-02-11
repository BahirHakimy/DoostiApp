import { FaMoon, FaPaintBrush, FaSun } from "react-icons/fa";
import { ToggleButton } from "../../Shared";

function Appearance({ theme, onThemeChange }) {
  return (
    <div>
      <div className={`settings-header header-${theme}`}>
        <FaPaintBrush />
        Appearance
      </div>
      <div className={`settings-group group-${theme}`}>
        <div className="flex">
          <b className="setting-title">Theme:</b>
          <p className="setting-caption">Select your prefered theme</p>
        </div>
        <div id="ToggleButtonContainer" className="flex">
          <FaMoon
            color={theme === "dark" ? "var(--light)" : "var(--dark)"}
            size="25px"
            style={{ padding: "0 .5rem" }}
          />
          <ToggleButton on={theme === "light"} callback={onThemeChange} />
          <FaSun
            size="25px"
            color={theme === "light" ? "var(--yellow)" : "var(--dark)"}
            style={{ padding: "0 .5rem" }}
          />
        </div>
      </div>
    </div>
  );
}
export default Appearance;
