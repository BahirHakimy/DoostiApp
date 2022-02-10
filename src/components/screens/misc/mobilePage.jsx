import { FaFacebook, FaGoogle, FaTwitter, FaWhatsapp } from "react-icons/fa";

function MobilePage(props) {
  const facebook = "https://www.facebook.com/profile.php?id=100004886324671";
  const whatsapp = "https://api.whatsapp.com/send?phone=+93744570916";
  const gmail = "mailto:bahirhakimy2015@gmail.com";
  const twitter = "https://twitter.com/2020Bahirhakimy";

  return (
    <div
      className="flex"
      style={{
        background: "var(--gradient-light)",
        minHeight: "100vh",
        flexDirection: "column",
        fontSize: "1.4rem",
        padding: "0 0.5rem",
        color: "var(--dark)",
      }}
    >
      <div
        className="flex"
        style={{
          flexDirection: "column",
          padding: "1rem",
          marginBottom: "1rem",
        }}
      >
        <img src={`favicon144.png`} alt="" />
        <h4
          style={{
            fontWeight: "600",
            textShadow: ".1rem .1rem .1rem var(--gray)",
            color: "#970043",
            paddingLeft: "1rem",
            margin: 0,
            fontSize: "2rem",
          }}
        >
          Dosti
        </h4>
      </div>
      <p>
        Sorry this app is not intended for mobile devices. Please use a Desktop
        or Laptop PC to view the app
      </p>
      <p style={{ direction: "rtl" }}>
        معذرت میخواهیم این برنامه با گوشی سازگاری ندارد لطفا برای دیدن برنامه از
        کامپیوتر استفاده نمایید
      </p>
      <p
        style={{
          color: "var(--dark)",
        }}
      >
        Contact Developer
      </p>
      <p className="App-link">@BahirHakimi</p>
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
  );
}

export default MobilePage;
