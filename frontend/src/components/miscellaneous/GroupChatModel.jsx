import axios from "axios";
import { ChatState } from "../../contexts/ChatProvider";

import "./GroupChatModel.scss";
import "../miscellaneous/SideDrawer.scss";

import React, { useState, useEffect } from "react";
import UserListItem from "./UserListItem";
import UserBadgeItem from "./UserBadgeItem";

const GroupChatModel = (props) => {
  const [groupChatName, setGroupChatName] = useState();
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState();

  const { user, chats, setChats } = ChatState();

  // for search users in group chat. needs to be fixed
  useEffect(() => {
    async function handleSearch() {
      const query = search;
      // setSearch(query);
      if (!query) return;
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        };

        const { data } = await axios.get(`/api/user?search=${search}`, config);

        setSearchResult(data);
      } catch (err) {
        console.log("Failed to load the Search Results !!");
      }
    }

    handleSearch();
  }, [search]);

  //   const handleSearch = async (query) => {
  //     setSearch(query);
  //     if (!query) return;
  //     try {
  //       const config = {
  //         headers: {
  //           Authorization: `Bearer ${user.token}`,
  //         },
  //       };

  //       const { data } = await axios.get(`/api/user?search=${search}`, config);
  //       console.log(data);
  //       setSearchResult(data);
  //     } catch (err) {
  //       console.log("Failed to load the Search Results !!");
  //     }
  //   };
  const handleSubmit = async () => {
    if (!groupChatName || !selectedUsers) {
      console.log("Kindly fill all the fields !!");
      return;
    }

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.post(
        "/api/chat/group",
        {
          name: groupChatName,
          users: JSON.stringify(selectedUsers.map((u) => u._id)),
        },
        config
      );

      setChats([data, ...chats]);
      //   onclose();
      props.openCloseHandler();
      console.log("New group chat created !!");
    } catch (err) {
      console.log("Failed to create the group chat !!");
    }
  };

  const handleGroup = (userToAdd) => {
    if (selectedUsers.includes(userToAdd)) return;

    setSelectedUsers([...selectedUsers, userToAdd]);
  };

  const handleDelete = (userToDelete) => {
    setSelectedUsers(
      selectedUsers.filter((sel) => sel._id !== userToDelete._id)
    );
  };

  return (
    <>
      <div className="modal-overlay">
        <div className="modal">
          <div className="close" onClick={props.openCloseHandler}>
            <span className="material-icons-outlined">cancel</span>
          </div>
          <h1 className="modal-title">Create Group Chat</h1>
          <div className="modal-info">
            <div className="input-forms">
              <input
                onChange={(e) => setGroupChatName(e.target.value)}
                placeholder="Chat Name"
              ></input>

              <input
                //   onChange={(e) => handleSearch(e.target.value)}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Add users"
              ></input>
            </div>

            {/* Selected Users */}
            <div className="selected-users">
              {selectedUsers.map((u) => (
                <UserBadgeItem
                  key={user._id}
                  user={u}
                  handleFunction={() => handleDelete(u)}
                />
              ))}
            </div>
            <div className="searched-users">
              {searchResult?.map((user) => (
                <UserListItem
                  handleFunction={() => handleGroup(user)}
                  key={user._id}
                  user={user}
                />
              ))}
            </div>
            {/* CREATE CHAT BUTTON */}
            <button onClick={handleSubmit}>Create Chat</button>
          </div>
        </div>
      </div>
    </>
  );
};

export default GroupChatModel;
