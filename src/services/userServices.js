import { getUsers } from "../data/fakeUsers";

const users = getUsers();

function addUser(user) {
  users.push(user);
}

function getUser(id) {
  const user = users.find((u) => u.id === id);
  if (user) return user;
  else return { Error: { message: "No user with the given id" } };
}

function updateUser(id, updatedUser) {
  const index = users.findIndex((u) => u.id === id);
  if (index !== -1) users[index] = { ...users[index], ...updatedUser };
  else {
    return { Error: { message: "No user with the given id" } };
  }
}

function addFriend(uId, fId) {
  const user = getUser(uId);
  if (user) {
    const index = user.friends.indexof(fId);
    if (index === -1) user.friends.push(fId);
    else {
      return { Error: { message: "User is already one of your friends!" } };
    }
  } else {
    return { Error: { message: "User Id is invalid!" } };
  }
}

function removeFriend(uId, fId) {
  const user = getUser(uId);
  if (user) {
    const index = user.friends.indexof(fId);
    if (index !== -1) delete user.friends[index];
    else {
      return { Error: { message: "User is not your friend!" } };
    }
  } else {
    return { Error: { message: "User Id is invalid!" } };
  }
}

export { addUser, getUser, updateUser, addFriend, removeFriend };
