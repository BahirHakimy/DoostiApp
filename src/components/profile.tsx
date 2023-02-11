import React from "react";
import { ProfileImage, Sbutton as Button } from "./lib";
import { capitalize } from "lodash";
import { useAsync } from "../services/utils";
import { ErrorBox, FileChooser, ProgressBar } from "./Shared";
import { Spinner } from "./lib";
import { axios } from "../services/client";
import Camera from "./screens/misc/camera";
import Crop from "./screens/misc/cropper";
import "./styles/profile.css";
import {
  FaCamera,
  FaCheckCircle,
  FaFemale,
  FaGenderless,
  FaMale,
  FaMapMarkerAlt,
  FaTimes,
  FaTimesCircle,
  FaUpload,
} from "react-icons/fa";
import { RiEdit2Line } from "react-icons/ri";
import { AiFillWarning } from "react-icons/ai";
import { useUser, useTheme } from "./common/hooks";
import { toast } from "react-toastify";

const Profile = ({ refresh, dark }) => {
  const { username } = useUser();
  const { currentTheme } = useTheme();

  const {
    data: profile,
    run,
    error,
    isIdle,
    isPending,
    isSuccess,
    isRejected,
    setData,
    reFetch,
  } = useAsync();

  const userInfoRefs = React.useRef([]);
  const fileChooserRef = React.useRef();
  const [hover, setHover] = React.useState(false);
  const [selectedCountry, setSelecetedCountry] = React.useState();

  const [editState, setEditState] = React.useState({
    index: -1,
    data: { caption: "", type: "" },
    warning: null,
    pending: false,
  });
  const [cameraState, setCameraState] = React.useReducer(
    (s, a) => ({ ...s, ...a }),
    {
      image: null,
      croppedImage: null,
      shot: false,
      type: null,
    }
  );
  const [uploadState, setUploadState] = React.useReducer(
    (s, a) => ({ ...s, ...a }),
    {
      show: false,
      percent: 0,
    }
  );

  const { shot, type, image, croppedImage } = cameraState;
  const CROPPER_CONFIG = {
    profile: { aspectRatio: 1, size: { height: 400, width: 400 } },
    cover: { aspectRatio: 2.27, size: { height: 360, width: 820 } },
  };

  React.useEffect(() => {
    run(axios.post("users/me/", { username }));
  }, [run, username]);

  function showEditForm(selfParentIndex, formData) {
    if (editState.index !== -1) {
      setEditState({ ...editState, warning: "Please close this form first!" });
    } else {
      const [, parent] = selfParentIndex;
      const element = userInfoRefs.current[parent];
      blur.do(element);
      setEditState({ index: parent, data: formData });
    }
  }

  function closeEditForm(refIndex) {
    const element = userInfoRefs.current[refIndex];
    blur.undo(element);
    setEditState({ index: -1, data: null, warning: null, pending: false });
  }

  const blur = {
    do: (element) => {
      element.childNodes.forEach((el) => {
        if (el.className !== "editForm") {
          el.style.filter = "blur(3px)";
        }
      });
    },
    undo: (element) => {
      element.childNodes.forEach((el) => {
        if (el.className !== "editForm") {
          el.style.filter = "none";
        }
      });
    },
  };

  function handleSubmit(event) {
    event.preventDefault();
    const data = {};
    for (let element of event.target.elements) {
      if (element.name) {
        data[element.name] = element.value;
      }
    }
    const newData = cleanData(data);
    if (newData) {
      setEditState({ ...editState, pending: true });
      axios.post("personalInfo/update/", { username, ...newData }).then(
        ({ data }) => {
          closeEditForm(editState?.index);
          setData({ ...profile, ...newData });
          toast.success(data?.message);
        },
        (error) => {
          toast.error("Something went wrong please refer to console");
          console.error(error.response);
        }
      );
    }
  }

  function handleUpload() {
    if (type) {
      setUploadState({ show: true });
      const data = new FormData();
      data.append("username", username);
      data.append("type", type);
      data.append("image", croppedImage.split(",")[1]);
      axios
        .post("personalInfo/update/media/", data, {
          timeout: 60000,
          onUploadProgress: (progress) => {
            setUploadState({
              percent: Math.round((100 * progress.loaded) / progress.total),
            });
          },
        })
        .then(
          (response) => {
            toast(response.data?.message);
            setUploadState({ show: false, percent: 0 });
            setCameraState({ croppedImage: null });
            reFetch();
            refresh();
          },
          (error) => {
            setUploadState({ show: false, percent: 0 });
            setCameraState({ croppedImage: null });
            console.log(error);
            toast.error(error.message);
          }
        );
    } else {
      toast.error("Something went wrong, Please try again");
    }
  }

  function cleanData(data) {
    const currentData = { ...profile, ...profile.user, user: null };

    const cleanedData = {};
    Object.keys(data).forEach((key) => {
      if (
        data[key].toLowerCase().trim() !==
        currentData[key]?.toLowerCase().trim()
      ) {
        cleanedData[key] = data[key];
      }
    });
    return Object.keys(cleanedData).length > 0 ? cleanedData : null;
  }

  function createElementRef(el, index) {
    if (userInfoRefs.current === null) {
      userInfoRefs.current = [];
    }
    userInfoRefs.current[index] = el;
  }

  if (isPending || isIdle) {
    return (
      <div className={`fullcenter ${currentTheme}`}>
        <Spinner
          size="30px"
          color={currentTheme === "light" ? "var(--dark)" : "var(--light)"}
        />
      </div>
    );
  }

  if (isRejected) {
    return (
      <div className="fullcenter">
        <ErrorBox error={error.message} />
      </div>
    );
  }
  if (isSuccess) {
    return shot ? (
      <Camera
        onCapture={(image) => setCameraState({ image, shot: false })}
        onClose={() => setCameraState({ shot: false })}
      />
    ) : image ? (
      <Crop
        image={image}
        {...CROPPER_CONFIG[type]}
        onCrop={(cropped) =>
          setCameraState({ image: null, croppedImage: cropped })
        }
      />
    ) : croppedImage ? (
      <div id="previewContainer">
        <img id="imagePreview" alt="imagePreview" src={croppedImage} />
        <ProgressBar show={uploadState.show} percent={uploadState.percent} />
        <div>
          <Button disabled={uploadState.show} onClick={handleUpload}>
            Ok
          </Button>
          <Button
            disabled={uploadState.show}
            onClick={() => setCameraState({ croppedImage: null, type: null })}
          >
            Cancel
          </Button>
        </div>
      </div>
    ) : (
      <div
        id="profilePageContainer"
        style={{ background: `var(--${currentTheme})` }}
      >
        <div id="profileCPContainer">
          <img
            id="profileCoverPhoto"
            src={profile.cover_photo}
            alt="cover_photo"
          />
          <button
            className="fadeButton bottomDark"
            onClick={() => {
              setCameraState({ type: "cover" });
              fileChooserRef.current.click();
            }}
          >
            <RiEdit2Line />
            Change
          </button>
        </div>
        <div
          id="profileInfoContainer"
          style={{ background: `var(--${currentTheme})` }}
        >
          <div
            id="simpleSnippet"
            style={{ background: `var(--${currentTheme})` }}
          >
            <div
              id="profileImageContainer"
              onMouseEnter={() => setHover(true)}
              onMouseLeave={() => setHover(false)}
            >
              <div className={hover ? "topSlider top" : "topSlider"}></div>
              <div
                className={hover ? "bottomSlider bottom" : "bottomSlider"}
              ></div>
              <div
                id="buttonsContainer"
                style={{ display: hover ? "flex" : "none" }}
              >
                <button
                  className="fadeButton"
                  title="Take a Photo"
                  onClick={() =>
                    setCameraState({ shot: true, type: "profile" })
                  }
                >
                  <FaCamera size="15px" />
                  {"  "}Take
                </button>
                <FileChooser
                  onSelect={(image) => setCameraState({ image })}
                  refrence={fileChooserRef}
                />
                <button
                  className="fadeButton"
                  title="Upload a Photo"
                  onClick={() => {
                    setCameraState({ type: "profile" });
                    fileChooserRef.current.click();
                  }}
                >
                  <FaUpload size="15px" />
                  {"  "}Select
                </button>
              </div>
              <ProfileImage
                src={profile.profile_pic}
                alt="profile_pic"
                size="big"
                className={hover ? "blur" : ""}
              />
            </div>

            <div id="initialInfo" ref={(el) => createElementRef(el, 2)}>
              <h3 className={`title-for${currentTheme}`}>{profile.fullname}</h3>
              <p className={`title-for${currentTheme}`}>{profile.bio}</p>
              <p
                style={currentTheme === "dark" ? { color: "var(--light)" } : {}}
              >
                <FaMapMarkerAlt /> {capitalize(profile.city)}/
                {capitalize(profile.country)}
              </p>
              <p id="editButton" onClick={() => showEditForm([0, 2], {})}>
                <RiEdit2Line size="18px" /> Edit
              </p>
              {editState.index === 2 && (
                <form
                  name="initialInfo"
                  className="initialInfoForm"
                  onSubmit={handleSubmit}
                >
                  <div className="editFormContainer smallWidthTall">
                    <button
                      title="Close"
                      onClick={() => closeEditForm(2)}
                      className="editFormClose"
                    >
                      <FaTimes size="18px" />
                    </button>
                    <p className="initialInfoFormTitle">Edit your Info</p>
                    <input
                      autoFocus
                      className="editFormInput"
                      placeholder="Firstname"
                      name="first_name"
                      type="text"
                      defaultValue={profile.fullname.split(" ")[0]}
                    />
                    <input
                      className="editFormInput"
                      placeholder="Lastname"
                      name="last_name"
                      type="text"
                      defaultValue={profile.fullname.split(" ")[1]}
                    />

                    <input
                      className="editFormInput"
                      placeholder="Bio"
                      name="bio"
                      type="text"
                      defaultValue={profile.bio}
                    />
                    <div id="editFormSelectGroup">
                      <select
                        name="country"
                        className="editFormSelect smallSelect"
                        defaultValue={capitalize(profile.country)}
                        onChange={(event) => {
                          setSelecetedCountry(event.target.value);
                        }}
                      >
                        {countries.map((cn) => (
                          <option key={cn} value={cn}>
                            {cn}
                          </option>
                        ))}
                      </select>
                      <select
                        name="city"
                        className="editFormSelect smallSelect"
                        defaultValue={capitalize(profile.city)}
                      >
                        {cities[
                          selectedCountry || capitalize(profile.country)
                        ].map((ct) => (
                          <option key={ct} value={ct}>
                            {ct}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      {editState.pending ? (
                        <Spinner size="20px" />
                      ) : (
                        <button
                          title="Ok"
                          type="submit"
                          className="editFormButton1 hover customMargin"
                        >
                          <FaCheckCircle size="20px" />
                        </button>
                      )}
                      <button
                        onClick={() => closeEditForm(2)}
                        title="Cancel"
                        className="editFormButton2 hover customMargin"
                      >
                        <FaTimesCircle size="20px" />
                      </button>
                    </div>
                    {editState.warning != null ? (
                      <p className="editFormWarning">
                        <AiFillWarning /> {editState.warning}
                      </p>
                    ) : null}
                  </div>
                </form>
              )}
            </div>
          </div>
          <div></div>
          <div
            id="additionalInfo"
            style={{ background: `var(--${currentTheme})` }}
          >
            {structure(profile).map((set) => {
              return (
                <div
                  ref={(el) => createElementRef(el, set.refIndex)}
                  className="userInfo"
                  key={set.refIndex}
                >
                  {set.map.map((st) => {
                    return (
                      <div
                        className="infoSet"
                        style={
                          currentTheme === "dark"
                            ? { color: `var(--light)` }
                            : {}
                        }
                        key={st.caption}
                      >
                        <div className="infoPart">
                          <p className="infoCaption">{st.caption} </p>
                          <p className="infoContent">{st.content}</p>
                        </div>
                        <div
                          className="editPart"
                          title="Edit"
                          onClick={() =>
                            showEditForm(st.selfParentIndex, {
                              name: st.name,
                              caption:
                                st.caption === "Age: "
                                  ? "BirthDate:"
                                  : st.caption,
                              type: st.caption === "Age: " ? "date" : st.type,
                              options: st.options,
                              default:
                                st.name === "date_of_birth"
                                  ? formatDate(profile.date_of_birth, true)
                                  : st.name === "email"
                                  ? profile.user[st.name]
                                  : profile[st.name],
                            })
                          }
                        >
                          <RiEdit2Line />
                        </div>
                      </div>
                    );
                  })}
                  {editState.index === set.refIndex && (
                    <form className="editForm" onSubmit={handleSubmit}>
                      <div className="editFormContainer">
                        <button
                          title="Close"
                          onClick={() => closeEditForm(set.refIndex)}
                          className="editFormClose"
                        >
                          <FaTimes size="18px" />
                        </button>
                        <p className="editFormTitle">
                          {editState.data?.caption}
                        </p>
                        {editState.data.type !== "select" ? (
                          <>
                            {editState.data.type === "date" ? (
                              <p className="textLight">Pick a Date</p>
                            ) : (
                              <p className="textLight">Enter new value </p>
                            )}
                            <input
                              autoFocus
                              className="editFormInput"
                              name={editState.data?.name}
                              type={editState.data?.type || "text"}
                              defaultValue={editState.data?.default}
                            />
                          </>
                        ) : (
                          <>
                            <p className="textLight">Select a value</p>

                            <select
                              className="editFormSelect"
                              name={editState.data.name}
                              defaultValue={editState.data?.default}
                            >
                              {editState.data.options.map((op) => (
                                <option key={op[0]} value={op[1]}>
                                  {op[0]}
                                </option>
                              ))}
                            </select>
                          </>
                        )}
                        <div>
                          {editState.pending ? (
                            <Spinner size="20px" />
                          ) : (
                            <button
                              title="Ok"
                              type="submit"
                              className="editFormButton1 hover"
                            >
                              <FaCheckCircle size="20px" />
                            </button>
                          )}
                          <button
                            onClick={() => closeEditForm(set.refIndex)}
                            title="Cancel"
                            className="editFormButton2 hover"
                          >
                            <FaTimesCircle size="20px" />
                          </button>
                        </div>
                        {editState.warning != null ? (
                          <p className="editFormWarning">
                            <AiFillWarning /> {editState.warning}
                          </p>
                        ) : null}
                      </div>
                    </form>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }
};

function structure(profile) {
  return [
    {
      refIndex: 0,
      map: [
        {
          name: "workplace",
          caption: "WorksAt: ",
          content: profile.workplace,
          selfParentIndex: [1, 0],
        },
        {
          name: "email",
          caption: "Email: ",
          content: profile.user.email,
          selfParentIndex: [1, 0],
          type: "email",
        },
        {
          name: "gender",
          caption: "Gender: ",
          content: getGender(profile.gender),
          selfParentIndex: [2, 0],
          type: "select",
          options: [
            ["Male", "M"],
            ["Female", "F"],
            ["Not Specified", "NS"],
          ],
        },
      ],
    },
    {
      refIndex: 1,
      map: [
        {
          name: "date_of_birth",
          caption: "Age: ",
          content: getAge(profile.date_of_birth),
          selfParentIndex: [0, 1],
        },
        {
          name: "marital_state",
          caption: "Marital State: ",
          content: getMaritalState(profile.marital_state),
          selfParentIndex: [1, 1],
          type: "select",
          options: [
            ["Single", "S"],
            ["Maried", "M"],
            ["Engaged", "E"],
          ],
        },
        {
          name: "date_of_birth",
          caption: "BirthDate: ",
          content: formatDate(profile.date_of_birth),
          selfParentIndex: [2, 1],
          type: "date",
        },
      ],
    },
  ];
}

function getGender(gender) {
  switch (gender) {
    case "M":
      return (
        <>
          <FaMale /> Male
        </>
      );
    case "F":
      return (
        <>
          <FaFemale /> Female
        </>
      );

    default:
      return (
        <>
          <FaGenderless /> Not Specified
        </>
      );
  }
}

function getMaritalState(state) {
  switch (state) {
    case "S":
      return "Single";
    case "M":
      return "Maried";
    default:
      return "Engaged";
  }
}

function getAge(timeString) {
  const date = new Date(timeString);
  const currentData = new Date();
  const miliSeconds = currentData.getTime() - date.getTime();
  const age = (miliSeconds / (365 * 86400000)).toString();
  return age.substring(0, age.indexOf("."));
}

const months = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

function formatDate(dateString, edit = false) {
  const date = new Date(dateString);
  const month = months[date.getMonth()];
  const day = date.getDate();
  const year = date.getFullYear();
  if (edit) {
    let newDay = day < 10 ? `0${day}` : day;
    let newMonth = date.getMonth() + 1;
    newMonth = newMonth < 10 ? `0${newMonth}` : newMonth;
    return `${year}-${newMonth}-${newDay}`;
  }
  return `${month} ${day} ${year}`;
}

const countries = ["Afghanistan", "Iran", "UnitedStates", "England"];

const cities = {
  Afghanistan: [
    "Kabul",
    "Badakhshan",
    "Herat",
    "Balkh",
    "Laghman",
    "Kandahar",
    "Takhar",
  ],
  Iran: ["Tehran", "Isfahan"],
  UnitedStates: ["W.D.C", "NewYork", "Florida"],
  England: ["London", "Birmingham"],
};

export { getAge, countries, formatDate, cities };
export default Profile;
