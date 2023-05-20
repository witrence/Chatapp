import "./ScrollableChat.scss";

import {
  isLastMessage,
  isSameSender,
  isSameSenderMargin,
  isSameUser,
} from "../config/ChatLogics";
import { ChatState } from "../contexts/ChatProvider";
import { useEffect, useRef } from "react";

const ScrollableChat = ({ messages }) => {
  const { user } = ChatState();

  const messagesEndRef = useRef(null);

  // console.log("PRINTING messages from scrolllable");
  // console.log(messages);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className="scrollable-chat">
      {/* {temp && temp.map((t) => <div>tis printing</div>)} */}
      {messages &&
        Object.values(messages).map((message, i) => (
          <div
            className={`message ${
              message.sender._id === user._id ? "send" : "receive"
            }`}
            style={{ display: "flex" }}
            key={message._id}
          >
            {/* {(isSameSender(messages, message, i, user._id) ||
              isLastMessage(messages, i, user._id)) && (
              <>
                <img src={message.sender.pic} alt="sender's pic" />
              </>
            )} */}

            {/* *************** MESSAGE CONTENT ***************** */}
            {/* <span
              className={`${
                message.sender._id === user._id ? "send" : "receive"
              }`}
              // style={{
              //   backgroundColor: `${
              //     message.sender._id === user._id ? "pink" : "#B9F5D0"
              //   }`,
              //   marginLeft: isSameSenderMargin(messages, message, i, user._id),
              //   marginTop: isSameUser(messages, message, i, user._id) ? 3 : 10,
              //   borderRadius: "20px",
              //   padding: "5px 15px",
              //   maxWidth: "75%",
              // }}
            > */}
            {message.content}
            <p className="message-date">
              {new Date(message.createdAt).getHours() +
                ":" +
                String(new Date(message.createdAt).getMinutes()).padStart(
                  2,
                  "0"
                )}
            </p>
            {/* </span> */}
          </div>
        ))}
      <div ref={messagesEndRef} style={{ padding: ".3rem" }} />
    </div>
  );
};

export default ScrollableChat;
