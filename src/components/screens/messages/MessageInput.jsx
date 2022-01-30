/** @jsxImportSource @emotion/react */
import React from "react";
import { FaMicrophone, FaTrash } from "react-icons/fa";
import { AiOutlineSend, AiOutlineSmile, AiOutlineLink } from "react-icons/ai";
import { Input, Spinner } from "../../lib";
import Picker from "emoji-picker-react";
import { FileChooser } from "../../Shared";
import { axios } from "../../../services/client";
import { toast } from "react-toastify";

const MessageInput = ({
  submitEnabled,
  onSubmit,
  username,
  room_id,
  onUpload,
  theme,
}) => {
  const [showEmojiPanel, setShowEmojiPanel] = React.useState(false);
  const [uploadState, setUploadState] = React.useState({
    uploading: false,
    progress: 0,
  });
  const [text, setText] = React.useState("");
  const fileChooserRef = React.useRef(null);
  const recorderRef = React.useRef(null);
  const chunksRef = React.useRef([]);
  const [recordState, setRecordState] = React.useReducer(
    (s, a) => ({ ...s, ...a }),
    { recording: false, data: null, error: null }
  );

  const styles = {
    ":hover": {
      boxShadow: ".1rem .1rem .3rem #222",
      borderRadius: ".3rem",
    },
    ":active": {
      boxShadow: "inset .1rem .1rem .3rem #222",
      background: "#4485",
    },
    padding: ".5rem",
    color: theme === "dark" ? "var(--light)" : "var(--dark)",
    userSelect: "none",
  };

  function toggleEmojiPanel() {
    setShowEmojiPanel(!showEmojiPanel);
  }

  function handleEmojiSelect(event, emoji) {
    setText(text + emoji.emoji);
  }

  function handleInputChange(event) {
    event.preventDefault();
    setText(event.target.value);
  }

  function handleSubmit() {
    if (recordState.data) {
      const type = ".wav";
      handleFileSelect(recordState.data, type);
      setRecordState({ data: null });
    } else {
      if (text === "" || !submitEnabled) return;
      setShowEmojiPanel(false);
      onSubmit(text);
      setText("");
    }
  }

  function handleUpload(progress) {
    setUploadState({
      uploading: true,
      progress: Math.round((100 * progress.loaded) / progress.total),
    });
  }

  function handleFileSelect(file, fileType = null) {
    setUploadState({ uploading: true, progress: 0 });
    const formdata = new FormData();
    formdata.append("file", file);
    formdata.append("username", username);
    formdata.append("room_id", room_id);
    if (fileType) formdata.append("fileType", fileType);
    axios
      .post("rooms/messages/upload/", formdata, {
        baseURL: process.env.REACT_APP_ASGI_URL,
        timeout: 5 * 60000,
        onUploadProgress: handleUpload,
      })
      .then(
        (response) => {
          setUploadState({ ...uploadState, uploading: false });
          onUpload(response.data);
        },
        (error) => {
          setUploadState({ ...uploadState, uploading: false });
          if (error.response) {
            toast.error(error?.response?.message);
          } else {
            toast.error("Please check your connection");
          }
        }
      );
  }

  function handleRecording() {
    function recordInit() {
      navigator.mediaDevices.getUserMedia({ audio: true }).then(
        (stream) => {
          const recorder = new MediaRecorder(stream);
          recorderRef.current = recorder;
          recorder.ondataavailable = (e) => chunksRef.current.push(e.data);
          recorder.start();
          recorder.onstart = () => setRecordState({ recording: true });
          recorder.onstop = () => {
            if (chunksRef.current.length > 0) {
              const audio = new Blob(chunksRef.current, { type: "audio/wav" });
              chunksRef.current = [];
              setRecordState({
                data: audio,
                recording: false,
              });
            }
          };
        },
        (error) => {
          if (error.name === "NotAllowedError") {
            toast.warn("Access to microphone was blocked");
          } else {
            toast.error(error?.message);
          }
        }
      );
    }
    if (!recorderRef.current) {
      recordInit();
    } else {
      if (recorderRef.current.state === "recording") {
        recorderRef.current.stop();
      } else if (recorderRef.current.state === "inactive") {
        recorderRef.current = null;
        recordInit();
      } else {
        recorderRef.current.start();
      }
    }
  }

  return (
    <div
      css={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "flex-start",
        alignItems: "center",
        marginTop: "0",
        position: "relative",
      }}
    >
      {recordState.data ? (
        <div
          className="flex"
          css={{
            width: "45rem",
            height: "3rem",
            padding: "1rem",
            margin: "1rem",
          }}
        >
          <audio
            preload="auto"
            css={{ width: "95%" }}
            src={URL.createObjectURL(recordState.data)}
            controls={true}
          />
          <FaTrash
            title="Delete"
            color="var(--danger)"
            css={{
              padding: ".5rem",
              ":hover": { boxShadow: ".1rem .1rem .2rem var(--gray)" },
              ":active": { boxShadow: "inset .1rem .1rem .2rem var(--gray)" },
            }}
            onClick={() => setRecordState({ data: null })}
          >
            X
          </FaTrash>
        </div>
      ) : (
        <Input
          css={
            theme === "dark" && {
              background: "var(--dark)",
              color: "var(--light)",
              "::placeholder": { color: "var(--light)" },
            }
          }
          onChange={handleInputChange}
          onKeyPress={(e) => {
            if (e.key === "Enter") {
              handleSubmit();
            }
          }}
          onClick={() => setShowEmojiPanel(false)}
          type="text"
          value={text}
          name="message"
          placeholder="Write Something...."
        />
      )}
      <AiOutlineSmile size="30px" css={styles} onClick={toggleEmojiPanel} />
      {showEmojiPanel && (
        <Picker
          onEmojiClick={handleEmojiSelect}
          pickerStyle={{
            position: "absolute",
            bottom: "4rem",
            right: "0",
            width: "20rem",
            boxShadow: theme === "dark" && "none",
          }}
          disableSkinTonePicker={true}
          groupVisibility={{
            smileys_people: true,
            animals_nature: false,
            food_drink: false,
            travel_places: false,
            activities: false,
            objects: false,
            symbols: false,
            flags: false,
            recently_used: true,
          }}
        />
      )}
      <FileChooser
        refrence={fileChooserRef}
        onSelect={handleFileSelect}
        maxSize={50}
        allowedTypes={["*"]}
      />
      <FaMicrophone
        size="30px"
        onClick={handleRecording}
        css={styles}
        className={recordState.recording && "recordAnimation"}
      />
      {uploadState.uploading ? (
        <div
          title="Uploading ..."
          css={{
            position: "relative",
            background: `linear-gradient(0deg,#3334 ${uploadState.progress}%,white 0%)`,
            borderRadius: ".2rem",
          }}
        >
          <b
            css={{
              position: "absolute",
              margin: "auto",
              paddingTop: ".3rem",
              color: "var(--teal)",
            }}
          >
            {uploadState.progress}%
          </b>
          <Spinner size="30px" color="var(--secondary)" />
        </div>
      ) : (
        <AiOutlineLink
          size="30px"
          css={styles}
          onClick={() => fileChooserRef.current?.click()}
        />
      )}
      <AiOutlineSend
        size="30px"
        css={{
          ...styles,
          color: submitEnabled ? "blue" : "var(--info)",
        }}
        onClick={handleSubmit}
      />
    </div>
  );
};

export default MessageInput;
