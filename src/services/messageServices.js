import { getConversations } from "../data/fakeMessages";

const conversations = getConversations();

function getConversation(senderId, reciverId) {
  const conversation = conversations.find(
    (m) => m.userId === senderId && m.address === reciverId
  );
  if (conversation) return conversation;
  else return { Error: { message: "No conversation found!" } };
}

function sendMessage(sID, rID, message) {
  const conversation = conversations.find(
    (m) => m.userId === sID && m.address === rID
  );

  if (conversation) {
    conversation.content.push(message);
  } else {
    const newConversation = {
      userId: sID,
      address: rID,
      content: [message],
    };
    message.push(newConversation);
  }
}
function deleteMessage(sID, rID, mid) {
  const conversation = conversations.find(
    (m) => m.userId === sID && m.address === rID
  );

  if (conversation) {
    const index = conversation.content.findIndex((m) => m.Mid === mid);
    if (index !== -1)
      conversation.content[index].message = "this message was deleted!";
  } else {
    throw new Error("No conversation with the given data!");
  }
}

export { getConversation, sendMessage, deleteMessage };
