import React from "react";
import { Sbutton, Spinner } from "./lib";
import Crop from "./screens/misc/cropper";
import Camera from "./screens/misc/camera";
import "./styles/personalInfo.css";
import { toast } from "react-toastify";
import { countries, cities } from "./profile";
import { useSpring, animated } from "react-spring";
import { capitalize } from "lodash";
import Joi from "joi-browser";
import { AlertBox, FileChooser } from "./Shared";
import { baseAxios } from "../services/client";
import { login } from "../services/authServices";

const Button = (props) => (
  <Sbutton
    {...props}
    styleOverrides={{ boxShadow: ".1rem .1rem .2rem #111" }}
  />
);

const PersonalInfo = ({ user: { username, password, gender } }) => {
  const [state, dispatch] = React.useReducer((s, a) => ({ ...s, ...a }), {
    image: null,
    croppedImage: null,
    shot: null,
    currentPage: 1,
    animate: false,
    pending: false,
    selectedCountry: "Afghanistan",
    errors: {},
  });
  const fileChooserRef = React.createRef();
  const {
    image,
    pending,
    currentPage,
    animate,
    errors,
    croppedImage,
    shot,
    selectedCountry,
  } = state;

  const stracture = [
    {
      name: "country",
      type: "select",
      caption: "Select Your Hometown",
      content: countries,
    },
    {
      name: "city",
      type: "select",
      caption: "Select Your City",
      content: cities[selectedCountry],
    },
    { name: "workplace", caption: "Tell Us Where Do You Work" },
    { name: "bio", caption: "Write Something To Describe You" },
    {
      name: "date_of_birth",
      label: "birthdate",
      caption: "Pick Your BirthDay",
      type: "date",
    },
    {
      name: "marital_state",
      type: "select",
      caption: "What is your marital state",
      content: [
        ["S", "Single"],
        ["M", "Married"],
        ["E", "Engaged"],
      ],
    },
  ];

  const schema = {
    country: Joi.string().required().label("Country"),
    city: Joi.string().required().label("City"),
    workplace: Joi.string().required().label("Workplace").max(255),
    bio: Joi.string().required().label("Bio").max(100),
    date_of_birth: Joi.string().required().label("Birthdate"),
    marital_state: Joi.string().required().label("MaritaleState"),
  };

  const styles = useSpring({
    from: { opacity: 0 },
    to: { opacity: 1 },
    reset: animate,
    config: { duration: 500 },
  });

  function handleCrop(cropped) {
    dispatch({ image: null, croppedImage: cropped });
  }

  function openFileChooser() {
    fileChooserRef.current?.click();
  }

  function openCamera() {
    dispatch({ shot: true });
  }

  function handleCapture(capture) {
    dispatch({ shot: false, image: capture });
  }

  function closeCamera() {
    dispatch({ shot: false });
  }

  function handleRetry() {
    dispatch({ croppedImage: null });
  }

  function goToNextPage() {
    dispatch({ currentPage: 2, animate: true });
  }
  function goToPreviousPage() {
    dispatch({ currentPage: 1, animate: true });
  }

  function handleSubmit(event) {
    dispatch({ pending: true, animate: false });
    event.preventDefault();
    const data = {};
    for (var input of event.target.elements) {
      if (input.name !== "") {
        data[input.name] = input.value;
      }
    }
    const { error } = Joi.validate(data, schema, { abortEarly: false });
    if (error) {
      const errors = {};
      for (let er of error.details) {
        errors[er.path[0]] = er.message;
      }
      console.log(error);
      dispatch({ errors, animate: false, pending: false });
    } else {
      dispatch({ errors: {}, animate: false });
      const data = new FormData(event.target);
      data.append("username", username);
      if (croppedImage) {
        const file = croppedImage.split(",")[1];
        data.append("profile_pic", file);
      }
      baseAxios.post("register/personalInfo/", data).then(
        ({ data: { message } }) => {
          dispatch({ pending: false });
          toast(message);
          continueLogin();
        },
        (error) => {
          dispatch({ pending: false });
          toast.error("Something went wrong please refer to console");
          console.log(error);
        }
      );
    }
  }

  function continueLogin() {
    dispatch({ pending: true });
    login({ username, password }).then(
      (response) => {
        window.location.replace("/profile");
      },
      (error) => {
        toast.error("Something went wrong please refer to console");
        console.log(error);
      }
    );
  }

  return (
    <div id="adInfoBackground">
      {shot ? (
        <Camera onCapture={handleCapture} onClose={closeCamera} />
      ) : (
        <>
          {image ? (
            <Crop image={image} onCrop={handleCrop} />
          ) : (
            <animated.div style={styles} id="adInfoMainContainer">
              <h4 className="title title-white">
                Please take a minute and complete your personal info
              </h4>
              <div id="fixedContainer">
                {currentPage === 1 ? (
                  <div id="firstScreen">
                    <img
                      id="adInfoAvatar"
                      alt="avatar"
                      height="256px"
                      width="256px"
                      src={
                        croppedImage || gender === "F"
                          ? "assets/default/UserFemale256.png"
                          : "assets/default/UserMale256.png"
                      }
                    />
                    <p className="avatarCaption">
                      Lets start with your profile picture :)
                    </p>
                    {croppedImage ? (
                      <div>
                        <Button onClick={handleRetry}>Retry</Button>
                        <Button onClick={goToNextPage}>Next</Button>
                      </div>
                    ) : (
                      <div id="buttonGroup">
                        <Button onClick={openCamera}>Take a photo</Button>
                        <Button onClick={openFileChooser}>
                          Upload a photo
                        </Button>
                        <FileChooser
                          refrence={fileChooserRef}
                          onError={() => dispatch({ image: null })}
                          onSelect={(image) => dispatch({ image })}
                        />
                        <Button onClick={goToNextPage} id="skipButton">
                          Skip
                        </Button>
                      </div>
                    )}
                  </div>
                ) : (
                  <form onSubmit={handleSubmit}>
                    <div id="secondScreen">
                      {stracture.map((st) =>
                        st.type === "select" ? (
                          <div key={st.name} className="pInfoInputGroup">
                            <p className="inputCaption">{st.caption}</p>
                            <div className="pInfoInputSet">
                              <label htmlFor={st.name}>
                                {capitalize(st.name)}:{" "}
                              </label>
                              <select
                                className="pInfoSelect"
                                onChange={
                                  st.name === "country"
                                    ? (e) =>
                                        dispatch({
                                          selectedCountry: e.target.value,
                                          animate: false,
                                        })
                                    : null
                                }
                                id={st.name}
                                name={st.name}
                              >
                                {st.content.map((value) =>
                                  st.name === "marital_state" ? (
                                    <option key={value} value={value[0]}>
                                      {value[1]}
                                    </option>
                                  ) : (
                                    <option key={value} value={value}>
                                      {value}
                                    </option>
                                  )
                                )}
                              </select>
                            </div>
                          </div>
                        ) : (
                          <div className="pInfoInputGroup" key={st.name}>
                            <p className="inputCaption">{st.caption}</p>
                            <div className="pInfoInputSet">
                              <label htmlFor={st.name}>
                                {capitalize(st.label ?? st.name)}:{" "}
                              </label>
                              <input
                                placeholder="Type here"
                                className={
                                  st.type === "date"
                                    ? "pInfoSelect"
                                    : "pInfoInput"
                                }
                                name={st.name}
                                type={st.type || "text"}
                                id={st.name}
                                max={st.type === "date" && "2020-01-01"}
                                min={st.type === "date" && "1930-01-01"}
                              />
                            </div>
                            <AlertBox
                              error={errors[st.name]}
                              styleOverrides={{
                                position: "absolute",
                                top: "5.5rem",
                                left: "4rem",
                              }}
                            />
                          </div>
                        )
                      )}

                      <div className="pInfoButtonsGroup">
                        {pending ? (
                          <Spinner
                            size="25px"
                            style={{ margin: "1.2rem 5rem 0 0" }}
                          />
                        ) : (
                          <>
                            <Button onClick={goToPreviousPage}>Back</Button>
                            <Button type="submit">Continue</Button>
                          </>
                        )}
                      </div>
                    </div>
                  </form>
                )}
              </div>
            </animated.div>
          )}
        </>
      )}
    </div>
  );
};

export default PersonalInfo;
