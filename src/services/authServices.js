import { toast } from "react-toastify";
import { axios, baseAxios, setTokens, TokenKey } from "./client";

const currentUserStorageKey = "CURRENT_USER";

function getCurrentUser() {
  const user = JSON.parse(localStorage.getItem(currentUserStorageKey));
  return user ?? null;
}

function setCurrentUser(data) {
  const user = {
    username: data.user.username,
  };

  localStorage.setItem(currentUserStorageKey, JSON.stringify(user));
}

async function login({ username, password }) {
  try {
    const response = await baseAxios.post("token/", { username, password });
    setTokens(response.data);
    try {
      const { data } = await axios.post("users/me/", { username });
      setCurrentUser(data);
      return { success: true };
    } catch (error) {
      return Promise.reject(error);
    }
  } catch (err) {
    if (!err.response) {
      toast.error("Please check your network connection");
    }
    return Promise.reject({ message: err.response?.data?.detail });
  }
}
function logout(message) {
  if (message) {
    alert(message);
  }
  localStorage.removeItem(currentUserStorageKey);
  localStorage.removeItem(TokenKey);
  window.location.replace("/login");
}

async function register(validatedData) {
  const nameSet = validatedData.fullname.split(" ");
  const [first_name, last_name] = nameSet;
  const data = {
    username: validatedData.username,
    email: validatedData.email,
    first_name,
    last_name,
    password: validatedData.password,
    gender: validatedData.gender,
  };
  try {
    const {
      data: { message },
    } = await baseAxios.post("register/", data);

    return {
      success: true,
      message,
    };
  } catch ({ response: { status, data } }) {
    let errors = {};
    if (status === 400) {
      Object.keys(data.errors).forEach((key) => {
        errors[key] = data.errors[key][0];
      });
    }

    return Promise.reject(errors);
  }
}

export { login, register, setCurrentUser, getCurrentUser, logout };
