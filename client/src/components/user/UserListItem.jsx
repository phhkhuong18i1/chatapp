import React from 'react';
import avatar from "../../assets/avatar.png";
const UserListItem = ({user, handleFunction}) => {
    return (
        <div className="d-flex pt-2 align-items-center flex-grow-1 cursor-pointer border-bottom" onClick={handleFunction}>
        <div className="me-2">
          <img
            className="rounded-circle object-fit-cover"
            src={avatar}
            height="35px"
            width="35px"
            alt=""
          />
        </div>
        <div className="text-content">
          <div className="name justify-content-start">
            {user?.name}
          </div>
          <div className="text">{user?.email}</div>
        </div>
      </div>
    );
};

export default UserListItem;