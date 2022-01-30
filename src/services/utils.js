import React from "react";
import { toast } from "react-toastify";
import { logout } from "./authServices";

function capitalize(value) {
  return value
    .split(" ")
    .map(
      (value) =>
        `${value[0].toUpperCase()}${value.substr(value.indexOf(value[1]))}`
    )
    .join(" ");
}

function useAsync(initialState) {
  const defaultInitialState = { status: "idle", data: null, error: null };

  const [{ status, data, error }, dispatch] = React.useReducer(
    (s, a) => ({ ...s, ...a }),
    {
      ...defaultInitialState,
      ...initialState,
    }
  );
  const [flag, setFlag] = React.useState(0);

  function setData(data) {
    dispatch({ status: "resolved", data });
  }

  function setError(error) {
    dispatch({ status: "rejected", error });
  }
  function reset() {
    dispatch(defaultInitialState);
  }

  function reFetch() {
    setFlag((prev) => prev + 1);
  }

  const run = React.useCallback(
    (promise) => {
      if (!promise || !promise.then) {
        throw new Error(
          "The given argument to the run function must be a promise"
        );
      }
      if (flag === 0) {
      }
      dispatch({ status: "pending" });
      promise
        .then((result) => dispatch({ data: result.data, status: "resolved" }))
        .catch((error) => {
          if (!error.response) {
            toast.error("Please check your network connection!");
            dispatch({
              data: null,
              error: { message: "No Connection" },
              status: "rejected",
            });
          } else if (
            error.response?.message ===
            "Authorization tokens has expired please reauthenticate"
          ) {
            logout(error.response.message);
          } else {
            dispatch({ data: null, error: error, status: "rejected" });
          }
        });
    },
    [flag]
  );
  return {
    isIdle: status === "idle",
    isPending: status === "pending",
    isSuccess: status === "resolved",
    isRejected: status === "rejected",
    run,
    data,
    error,
    setData,
    setError,
    reset,
    reFetch,
  };
}

const useSocket = (address) => {
  const socketRef = React.useRef(null);
  const [status, setStatus] = React.useState("Disconnected");
  const callbackRef = React.useRef(null);
  const initRef = React.useRef(null);

  const onMessage = (messageCallback) => {
    callbackRef.current = messageCallback;
  };

  React.useEffect(() => {
    if (status !== "Disconnected") return;
    setStatus("Connecting");
    const socket = new WebSocket(address);
    socketRef.current = socket;
    socket.onopen = () => setStatus("Connected");
    socket.onclose = () => {
      if (socketRef.current) {
        setStatus("Disconnected");
      } else {
        setStatus("Closed");
      }
    };
    socket.onerror = (e) => console.error(e?.message);
    socket.onmessage = (response) => {
      const { data } = response;
      const { reInitialize } = JSON.parse(data);
      if (reInitialize) socket.send(initRef.current);
      else callbackRef?.current(response);
    };
    return () => {
      if (status === "Connected") {
        socket.close();
        socketRef.current = null;
      }
    };
  }, [address, status]);

  const sendMessage = React.useCallback((message, isInit = false) => {
    if (isInit) initRef.current = message;
    if (!socketRef.current) {
      setStatus("Disconnected");
      setTimeout(() => sendMessage(message), 1500);
    } else {
      if (socketRef.current?.readyState === 1) {
        socketRef.current.send(message);
      } else {
        setTimeout(() => sendMessage(message), 1500);
      }
    }
  }, []);
  return {
    status,
    onMessage,
    sendMessage,
  };
};

export { useAsync, useSocket, capitalize };
