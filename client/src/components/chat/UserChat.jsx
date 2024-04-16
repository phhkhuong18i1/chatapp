import React, { memo, useContext } from "react";
import { useFetchRecipient } from "../../hooks/useFetchRecipient";
import { Stack } from "react-bootstrap";
import avatar from "../../assets/avatar.png";
import { ChatContext } from "../../context/ChatContext";
import { unReadNotifications } from "../../utils/unReadNotifications";
import { useFetchLatestMessage } from "../../hooks/useFetchLatestMessage";
import moment from "moment";
const UserChat = ({ chat, user }) => {
  const { recipientUser } = useFetchRecipient(chat, user);
  const { onlineUsers, notifications, readThisUserNotify } =
    useContext(ChatContext);

    const { latestMessage } = useFetchLatestMessage(chat, notifications)
  const unReadNotify = unReadNotifications(notifications);
  const thisUserNotifications = unReadNotify?.filter(
    (n) => n.senderId === recipientUser?._id
  );
  const isOnline = onlineUsers?.some(
    (user) => user?.userId === recipientUser?._id
  );

  const truncateText = (text) => {
    let shortText = text?.substring(0, 20);
    if(text?.length > 20){
      shortText += "...";
    }
    return shortText;
  }
  return (
    <Stack
      direction="horizontal"
      gap={4}
      className="user-card align-items-center p-2 justify-content-between"
      onClick={() => {
        if (thisUserNotifications?.length !== 0) {
          readThisUserNotify(thisUserNotifications, notifications);
        }
      }}
    >
      <div className="d-flex align-items-center">
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
            {recipientUser?.name}
          </div>
          <div className="text">{truncateText(latestMessage?.text)}</div>
        </div>
      </div>
      <div className="d-flex flex-column align-items-end">
        <div className="date">{moment(latestMessage?.createdAt).calendar()}</div>
        <div
          className={
            thisUserNotifications?.length > 0 ? "this-user-notifications" : ""
          }
        >
          {thisUserNotifications?.length > 0
            ? thisUserNotifications?.length
            : ""}
        </div>
        <span className={isOnline ? "user-online" : ""}></span>
      </div>
    </Stack>
  );
};

export default memo(UserChat);
