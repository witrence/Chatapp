import "./UpdateGroupChatModel.scss";

import React, { useState, useTransition } from "react";
import { ChatState } from "../../contexts/ChatProvider";
// import "./SideDrawer.scss";
import UserBadgeItem from "./UserBadgeItem";
import axios from "axios";
import UserListItem from "./UserListItem";
import { compareSync } from "bcryptjs";

const UpdateGroupChatModal = ({ fetchAgain, setFetchAgain, fetchMessages }) => {
  const [groupChatName, setGroupChatName] = useState();
  const [updateGroupOption, setUpdateGroupOption] = useState(false);

  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);

  const { selectedChat, setSelectedChat, user } = ChatState();
  const handleSearch = async (query) => {
    if (!query) return;
    // console.log("Printing from groupMODAL");
    // console.log(query);

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.get(`/api/user?search=${query}`, config);
      // console.log(data);

      setSearchResult(data);
    } catch (err) {
      console.log("Failed to load the search Results");
    }
  };

  const handleRemove = async (userToRemove) => {
    if (
      selectedChat.groupAdmin._id !== user._id &&
      userToRemove._id !== user._id
    ) {
      console.log("Only admins can remove users !!");
      return;
    }

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.put(
        "/api/chat/groupremove",
        {
          chatId: selectedChat._id,
          userId: userToRemove._id,
        },
        config
      );
      // if user has removed himself, then selected chat should be removed
      userToRemove._id === user._id ? setSelectedChat() : setSelectedChat(data);
      setFetchAgain(!fetchAgain);
      fetchMessages();
    } catch (err) {
      console.log(err.response.data.message);
    }
  };
  const handleRename = async () => {
    console.log(groupChatName);
    console.log(selectedChat);
    if (!groupChatName) return;

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.put(
        "/api/chat/rename",
        {
          chatId: selectedChat._id,
          chatName: groupChatName,
        },
        config
      );
      setSelectedChat(data);
      setFetchAgain(!fetchAgain);
    } catch (err) {
      console.log(err.response.data.message);
    }

    setGroupChatName("");
  };

  const handleAddUser = async (userToAdd) => {
    if (selectedChat.users.find((u) => u._id === userToAdd._id)) {
      console.log("User already in the group !!");
      return;
    }

    if (selectedChat.groupAdmin._id !== user._id) {
      console.log("Only admins can add users !!");
      return;
    }

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.put(
        "/api/chat/groupadd",
        {
          chatId: selectedChat._id,
          userId: userToAdd._id,
        },
        config
      );
      setSelectedChat(data);
      setFetchAgain(!fetchAgain);
    } catch (err) {
      console.log(err.response.data.message);
    }
  };

  return (
    <div>
      <button
        className="group-chat-modal-icon"
        onClick={() => setUpdateGroupOption(true)}
      >
        <span className="material-icons-outlined">group</span>
      </button>
      {updateGroupOption && (
        <div className="group-modal-overlay">
          <div className="group-modal">
            <span
              class="material-icons-outlined close"
              onClick={() => setUpdateGroupOption(false)}
            >
              cancel
            </span>

            <h1 className="group-modal-title">{selectedChat.chatName}</h1>
            <div className="group-modal-info">
              <div className="group-participants-box">
                <p> Participants</p>
                <div className="group-participants">
                  {selectedChat.users.map((u) => (
                    <UserBadgeItem
                      key={u._id}
                      user={u}
                      handleFunction={() => handleRemove(u)}
                    />
                  ))}
                </div>
              </div>
              <div className="group-update-options">
                <div className="rename-group">
                  <input
                    onChange={(e) => setGroupChatName(e.target.value)}
                    placeholder="Rename the group"
                    value={groupChatName}
                  />
                  <button onClick={handleRename}>Update</button>
                </div>
                <div className="add-users-group">
                  <input
                    onChange={(e) => handleSearch(e.target.value)}
                    placeholder="Add users to the group"
                  />
                  {/* <button onClick={handleRemove}>Add</button> */}
                </div>
              </div>
              <div className="group-add-users">
                {searchResult?.map((user) => (
                  <UserListItem
                    className="small"
                    key={user._id}
                    user={user}
                    handleFunction={() => handleAddUser(user)}
                  />
                ))}
              </div>
              {/* <div> */}
              <button className="modal-footer" onClick={handleRemove}>
                Leave Group
              </button>
              {/* </div> */}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UpdateGroupChatModal;
