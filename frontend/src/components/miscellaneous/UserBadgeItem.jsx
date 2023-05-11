import "./UserBadgeItem.scss";

const UserBadgeItem = ({ user, handleFunction }) => {
  return (
    <div className="participants-list">
      <span>{user.name}</span>

      <button title="Remove user from group" onClick={handleFunction}>
        Remove
      </button>
    </div>
  );
};

export default UserBadgeItem;
