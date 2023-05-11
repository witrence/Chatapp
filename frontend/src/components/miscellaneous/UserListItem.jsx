import React from "react";

import "./UserListItem.scss";

import { ChatState } from "../../contexts/ChatProvider";

const UserListItem = ({ className, user, handleFunction }) => {
  //   const { user } = ChatState();
  return (
    <div onClick={handleFunction} className={`user-list-item ${className}`}>
      <div className="searched-user ">
        <img src={user.pic} alt="user-img" />
        <span className="user-info">
          <p>{user.name}</p>
          {/* {user.email} */}
        </span>
      </div>
    </div>
  );
};

export default UserListItem;
