import "./MyChats.scss";

import React, { useEffect, useState } from "react";
import { ChatState } from "../contexts/ChatProvider";
import axios from "axios";

import { getSender } from "../config/ChatLogics";
import GroupChatModel from "./miscellaneous/GroupChatModel";

const MyChats = ({ fetchAgain }) => {
  const [loggedUser, setLoggedUser] = useState();

  const { selectedChat, setSelectedChat, user, chats, setChats } = ChatState();
  const [currentChat, setCurrentChat] = useState(); // temporar state to update selectedChat

  const [createGroupChat, setCreateGroupChat] = useState(false);

  const openCloseHandler = () => {
    setCreateGroupChat(!createGroupChat);
  };

  // for selecting the current chat
  // const selectChat = (chat) => {
  const setChatHandler = (chat) => {
    setCurrentChat(chat);
    console.log("SENDING chats from mychats");
    console.log(chats);
  };
  useEffect(() => {
    setSelectedChat(currentChat);
    if (currentChat) console.log(currentChat);
  }, [currentChat]);

  const groupChatHandler = () => {
    setCreateGroupChat(true);
  };

  const fetchChats = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.get("/api/chat", config);
      setChats(data);
    } catch (err) {
      console.log("ERROR fetching the chats");
    }
  };
  useEffect(() => {
    setLoggedUser(JSON.parse(localStorage.getItem("userInfo")));
    fetchChats();
  }, [fetchAgain]);

  return (
    <div className="my-contacts-area">
      {/* ****************** CONTACTS NAVIGATION BAR ******************** */}
      <nav className="nav-bar">
        <h2>CONTACTS</h2>
        <button
          title="Add new group"
          className="new-group-chat-button"
          onClick={groupChatHandler}
        >
          {/* <p>New Group Chat</p> */}
          <span class="material-icons-outlined">person_add</span>
        </button>
        {createGroupChat && (
          <GroupChatModel openCloseHandler={openCloseHandler} />
        )}
      </nav>

      <div className="existing-contacts-chats">
        {chats ? (
          chats.map((chat) => (
            <div
              className={`existing-contact-chat ${
                selectedChat === chat ? "active" : "green"
              }`}
              onClick={() => setChatHandler(chat)}
              key={chat._id}
              // style="background-color : black"
              // style={selectedChat === chat ? { backgroundColor: "pink" } : {}}
            >
              {/* <img src={getSender(loggedUser, chat.users).pic} alt="" /> */}
              <p>
                {!chat.isGroupChat
                  ? getSender(loggedUser, chat.users)
                  : chat.chatName}
              </p>
            </div>
          ))
        ) : (
          <p>No chats Available</p>
        )}
      </div>
    </div>
  );
};

export default MyChats;
