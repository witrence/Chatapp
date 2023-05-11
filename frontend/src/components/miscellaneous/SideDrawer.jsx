import axios from "axios";
import "./SideDrawer.scss";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import UserListItem from "./UserListItem";
import { ChatState } from "../../contexts/ChatProvider";

// change this props thing and use user using context
const SideDrawer = (props) => {
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const { setSelectedChat, chats, setChats } = ChatState();
  const navigate = useNavigate();
  const [dropdown, setDropdown] = useState(false);
  const [searchDrawer, setSearchDrawer] = useState(false);

  const openSearchDrawer = () => {
    setSearchDrawer(!searchDrawer);
  };

  const handleSearch = async () => {
    if (!search) {
      console.log("Please enter something in the search !!");
    }

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${props.user.token}`,
        },
      };
      const { data } = await axios.get(`/api/user?search=${search}`, config);

      setSearchResult(data);

      console.log(searchResult);
    } catch (err) {
      console.log("Failed to load the search results !!");
    }
  };

  const accessChat = async (userId) => {
    try {
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${props.user.token}`,
        },
      };
      const { data } = await axios.post("/api/chat", { userId }, config);

      if (!chats.find((c) => c._id === data._id)) setChats([data, ...chats]);

      setSelectedChat(data);
      openSearchDrawer(); // close the search drawer afterwards
    } catch (err) {}
  };

  const DropdownSwitch = () => {
    setDropdown(!dropdown);
  };

  const logoutHandler = () => {
    localStorage.removeItem("userInfo");
    navigate("/");
  };

  return (
    <div className="side-drawer">
      {/* ********************SEARCH USERS BUTTON********************  */}
      <div className="search-users-button" onClick={openSearchDrawer}>
        <span class="material-icons-outlined ">search</span>
        {/* <span>Search Users</span> */}
      </div>
      {/* ********************SEARCH OVERLAY********************  */}

      {searchDrawer && (
        <div className="search-overlay">
          <div className="search-bar">
            <div onClick={openSearchDrawer} className="close">
              <span class="material-icons-outlined close-icon">cancel</span>
            </div>
            <h1>Search Users</h1>
            <input
              onChange={(e) => setSearch(e.target.value)}
              value={search}
              placeholder="Search by name or email"
            ></input>
            <button onClick={handleSearch}>Go</button>
            <br /> {/* ********************** */}
            <span>
              {searchResult?.map((user) => (
                <UserListItem
                  key={user._id}
                  user={user}
                  className="large"
                  handleFunction={() => accessChat(user._id)}
                />
              ))}
            </span>
          </div>
        </div>
      )}
      {/* ************************ TITLE *************************** */}
      <h1 className="title">CHAT APP</h1>
      <div className="options">
        <button>
          <span title="Notifications" class="material-icons-outlined">
            notifications
          </span>
        </button>
        <button title="User Info" onClick={DropdownSwitch}>
          <span class="material-icons-outlined">expand_circle_down</span>
        </button>
        {dropdown && (
          <div className="modal-overlay">
            <div className="modal">
              <div className="close" onClick={DropdownSwitch}>
                <span class="material-icons-outlined close-icon">cancel</span>
              </div>
              <h1 className="modal-title">{props.user.name}</h1>
              <div className="modal-info">
                <img src={props.user.pic} alt={props.user.name} />
                <p className="modal-text">{props.user.email}</p>
              </div>
            </div>
          </div>
        )}
        <button title="Logout" onClick={logoutHandler}>
          <span class="material-icons-outlined">logout</span>
        </button>
      </div>
    </div>
  );
};

export default SideDrawer;
