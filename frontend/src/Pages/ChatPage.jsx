import "./ChatPage.scss";

import { ChatState } from "../contexts/ChatProvider";

import SideDrawer from "../components/miscellaneous/SideDrawer";
import MyChats from "../components/MyChats";
import ChatBox from "../components/ChatBox";
import { useState } from "react";

const Chats = () => {
  const { user } = ChatState();
  const [fetchAgain, setFetchAgain] = useState(false);

  return (
    <div className="chat-page">
      {/* **************** SIDE DRAWER ****************** */}
      {user && <SideDrawer user={user} />}
      <div className="chat-area">
        {user && <MyChats fetchAgain={fetchAgain} />}
        {user && (
          <ChatBox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
        )}
      </div>
    </div>
  );
};

export default Chats;
