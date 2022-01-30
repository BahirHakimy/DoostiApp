import { axios } from "../../services/client";

async function addFriend({ user, friend }) {
  const operation = "add";
  try {
    const response = await axios.post("friends/requests-operation/", {
      username: user,
      friend,
      operation,
    });
    return response?.data.message;
  } catch (error) {
    return Promise.reject(error);
  }
}

function unFriend() {}

function cancelRequest() {}

function decline() {}
