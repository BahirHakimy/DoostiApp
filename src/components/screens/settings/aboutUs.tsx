import React from "react";
import {
  FaFacebook,
  FaGoogle,
  FaInfoCircle,
  FaTwitter,
  FaWhatsapp,
} from "react-icons/fa";
function AboutUs({ theme }) {
  const facebook = "https://www.facebook.com/profile.php?id=100004886324671";
  const whatsapp = "https://api.whatsapp.com/send?phone=+93744570916";
  const gmail = "mailto:bahirhakimy2015@gmail.com";
  const twitter = "https://twitter.com/2020Bahirhakimy";
  return (
    <div>
      <div className={`settings-header header-${theme}`}>
        <FaInfoCircle />
        About
      </div>
      <div className={`settings-group group-${theme}`}>
        <code style={{ color: "var(--light)", paddingLeft: "1rem" }}>
          Version:{" "}
        </code>
        <code style={{ color: "var(--light)", paddingRight: "1rem" }}>
          0.1{" "}
        </code>
      </div>
      <div className={`aboutPage-${theme}`}>
        <div id="logoAndName">
          <img src="favicon72.png" alt="app-logo" />
          <p id="appName">Dosti</p>
        </div>
        <p
          style={{
            color: theme === "light" ? "var(--dark)" : "var(--light)",
            fontWeight: "lighter",
          }}
        >
          This app is built with Reactjs and was developed by Bahir Hakimy{" "}
        </p>
        <p
          style={{ color: theme === "light" ? "var(--dark)" : "var(--light)" }}
        >
          Contact Developer
        </p>
        <div className="flex" style={{ marginBottom: "1rem" }}>
          <a href={gmail} target="blank" className="contactLinkContainer">
            <FaGoogle color="var(--danger)" />
          </a>
          <a href={facebook} target="blank" className="contactLinkContainer">
            <FaFacebook color="var(--primary)" />
          </a>
          <a href={twitter} target="blank" className="contactLinkContainer">
            <FaTwitter color="var(--cyan)" />
          </a>
          <a href={whatsapp} target="blank" className="contactLinkContainer">
            <FaWhatsapp color="var(--success)" />
          </a>
        </div>
      </div>
    </div>
  );
}
export default AboutUs;
