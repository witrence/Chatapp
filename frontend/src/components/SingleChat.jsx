import "./SingleChat.scss";
import { ChatState } from "../contexts/ChatProvider";
import { getSender, getSenderFull } from "../config/ChatLogics";
import ProfileModal from "./miscellaneous/ProfileModal";
import UpdateGroupChatModal from "./miscellaneous/UpdateGroupChatModal";
import { useEffect, useState } from "react";
import axios from "axios";
import ScrollableChat from "./ScrollableChat";
import io from "socket.io-client";

const ENDPOINT = "http://localhost:5000";

let socket, selectedChatCompare;

const SingleChat = ({ fetchAgain, setFetchAgain }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const {
    user,
    selectedChat,
    setSelectedChat,
    notifications,
    setNotifications,
  } = ChatState();
  const [event, setEvent] = useState("");

  const [contactPic, setContactPic] = useState(null);

  const [socketConnected, setSocketConnected] = useState(false);
  const [roomID, setRoomID] = useState(null);

  const [typing, setTyping] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  // console.log("printing seleCHAT in singlechat comp");
  // console.log(selectedChat);

  useEffect(() => {
    socket = io(ENDPOINT);
    socket.emit("setup", user);
    socket.on("connected", () => setSocketConnected(true));
    socket.on("typing", () => setIsTyping(true));
    socket.on("stop typing", () => setIsTyping(false));
  }, []);

  const fetchMessages = async () => {
    if (!selectedChat) return;
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.get(
        `/api/message/${selectedChat._id}`,
        config
      );
      setMessages(data);
      // console.log("MEssages are here : ");
      // console.log(data);
      socket.emit("join chat", selectedChat._id);
    } catch (err) {
      console.log("Failed to load the messages !!");
    }
  };

  useEffect(() => {
    fetchMessages();
    setContactPicHandler();
    selectedChatCompare = selectedChat;
  }, [selectedChat]);

  const setContactPicHandler = () => {
    if (!selectedChat) return;
    if (selectedChat.isGroupChat) {
      setContactPic(null);
      return;
    }
    selectedChat.users.forEach((u) => {
      if (u._id !== user._id) {
        setContactPic(u.pic);
      }
    });
  };

  const sendMessage = async () => {
    if (event.key === "Enter" && newMessage) {
      socket.emit("stop typing", selectedChat._id);
      try {
        const config = {
          headers: {
            "Content-type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        };

        setNewMessage(""); // to make input field empty and let message send
        const { data } = await axios.post(
          "/api/message",
          {
            content: newMessage,
            chatId: selectedChat,
          },
          config
        );

        socket.emit("new message", data);
        setMessages([...messages, data]);
        setFetchAgain(!fetchAgain);
        // setSelectedChat(currC);
        // console.log("Cheking selcteddd ACCHAT");
        // console.log(selectedChat);
      } catch (err) {
        console.log("Failed to send a message");
      }
    }
  };
  useEffect(() => {
    sendMessage();
  }, [event.key === "Enter"]);

  const typingHandler = (e) => {
    setNewMessage(e.target.value);

    if (!socketConnected) return;

    if (!typing) {
      setTyping(true);
      socket.emit("typing", selectedChat._id);
    }

    // if users stope typing, stop the typing indicator after some time
    let lastTypingTime = new Date().getTime();

    const timerLength = 3000;

    setTimeout(() => {
      const timeNow = new Date().getTime();
      const timeDiff = timeNow - lastTypingTime;

      if (timeDiff >= timerLength && typing) {
        socket.emit("stop typing", selectedChat._id);
        setTyping(false);
      }
    }, timerLength);
  };

  // socket use effects are in order
  // in this use effect, socket is getting initialised.
  // without which the second use effect will not work

  useEffect(() => {
    socket.on("message received", (newMessageReceived) => {
      if (
        !selectedChatCompare ||
        selectedChatCompare._id !== newMessageReceived.chat._id
      ) {
        // give notification only
        if (!notifications.includes(newMessageReceived)) {
          setNotifications([newMessageReceived, ...notifications]);
          setFetchAgain(!fetchAgain);
        }
        // return;
      } else {
        setMessages([...messages, newMessageReceived]);
        setFetchAgain(!fetchAgain);
      }
    });
  });

  return (
    <>
      <div className="single-chat">
        {selectedChat ? (
          <div className="chat-display-area">
            {/* ************** CHAT NAVIGATION BAR ************* */}
            <div className="chat-nav-bar">
              <div className="contact-box">
                {contactPic && <img src={contactPic} />}
                {selectedChat.isGroupChat ? (
                  <h3 className="contact-name-indicator">
                    <p className="contact-name">{selectedChat.chatName}</p>
                    {/* {
                      <UpdateGroupChatModal
                        fetchAgain={fetchAgain}
                        setFetchAgain={setFetchAgain}
                        fetchMessages={fetchMessages}
                      />
                    } */}
                  </h3>
                ) : (
                  <h3 className="contact-name-indicator">
                    <p className="contact-name">
                      {getSender(user, selectedChat.users)}
                    </p>
                    {isTyping && (
                      <p
                        className="contact-typing-indicator"
                        title="user is typing"
                      >
                        typing...
                      </p>
                    )}

                    {/* <ProfileModal user={getSenderFull(user, selectedChat.users)} /> */}
                  </h3>
                )}
              </div>
              <div className="contact-options">
                <span title="Group Options" className="group-options">
                  {selectedChat.isGroupChat && (
                    <UpdateGroupChatModal
                      fetchAgain={fetchAgain}
                      setFetchAgain={setFetchAgain}
                      fetchMessages={fetchMessages}
                    />
                  )}
                </span>

                <span
                  title="Go Back"
                  onClick={() => setSelectedChat("")}
                  className="material-icons-outlined unselect-back-button"
                >
                  arrow_back
                </span>
              </div>
            </div>

            {/* ************* MESSAGES *************** */}
            <div className="messages">
              {/* {Messages} */}
              {messages.length > 0 ? (
                <ScrollableChat messages={messages} />
              ) : (
                <div className="no-chats">Let's start chatting</div>
              )}
            </div>
            {/* <form> */}
            <div className="input-message">
              <input
                type="text"
                // onKeyDown={sendMessage}
                onKeyDown={(e) => setEvent(e)}
                onChange={typingHandler}
                placeholder="Type a message"
                value={newMessage}
              />
            </div>
            {/* </form> */}
            {/* <button onClick={sendMessage}>Send</button>s */}
          </div>
        ) : (
          <div className="no-chat-selected-view">
            Search new users or click on the existing user to start chatting
          </div>
        )}
      </div>
    </>
  );
};

export default SingleChat;
