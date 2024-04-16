import React, { useContext, useState } from "react";
import moment from "moment";
import { ChatContext } from "../../context/ChatContext";
import { AuthContext } from "../../context/AuthContext";
import { unReadNotifications } from "../../utils/unReadNotifications";
const Notification = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useContext(AuthContext);
  const { notifications, userChats, allUsers, readAllNotify, showNotificationAsRead } =
    useContext(ChatContext);

  const unRead = unReadNotifications(notifications);
  const modifiedNotify = notifications.map((n) => {
    const sender = allUsers.find((user) => user._id === n.senderId);

    return {
      ...n,
      senderName: sender?.name,
    };
  });
  return (
    <div className="notifications">
      <div className="notifications-icon" onClick={() => setIsOpen(!isOpen)}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          fill="currentColor"
          className="bi bi-chat-fill"
          viewBox="0 0 16 16"
        >
          <path d="M8 15c4.418 0 8-3.134 8-7s-3.582-7-8-7-8 3.134-8 7c0 1.76.743 3.37 1.97 4.6-.097 1.016-.417 2.13-.771 2.966-.079.186.074.394.273.362 2.256-.37 3.597-.938 4.18-1.234A9 9 0 0 0 8 15" />
        </svg>
        {unRead?.length === 0 ? null : (
          <span className="notification-count">
            <span>{unRead?.length}</span>
          </span>
        )}
      </div>
      {isOpen ? (
        <div className="notifications-box">
          <div className="notifications-header">
            <h3>Thông báo</h3>
            <div
              className="mark-as-read"
              onClick={() => readAllNotify(notifications)}
            >
              Đọc tất cả
            </div>
          </div>
          {modifiedNotify?.length === 0 ? (
            <span className="notification">Không có thông báo mới...</span>
          ) : (
            modifiedNotify.map((n, index) => {
              return (
                <div
                  key={index}
                  className={
                    n.isRead ? "notification" : "notification not-read"
                  }
                  onClick={() =>{
                    showNotificationAsRead(n, userChats, user, notifications)
                    setIsOpen(false)
                  }}
                >
                  <span>{`${n.senderName} đã gửi tin nhắn mới`}</span>
                  <span className="notification-time">
                    {moment(n.date).calendar()}
                  </span>
                </div>
              );
            })
          )}
        </div>
      ) : null}
    </div>
  );
};

export default Notification;
