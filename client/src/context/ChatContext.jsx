import { createContext, useCallback, useEffect, useState } from "react";

import { baseUrl, getRequest, postRequest } from "../utils/service";
import { io } from "socket.io-client";

export const ChatContext = createContext();

export const ChatContextProvider = ({ children, user }) => {
  const [userChats, setUserChats] = useState(null);
  const [isUserChatsLoading, setIsUserChatsLoading] = useState(false);
  const [userChatsError, setUserChatsError] = useState(null);
  const [potentialChats, setPotentialChats] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);
  const [messages, setMessages] = useState(null);
  const [isMessageLoading, setIsMessageLoading] = useState(false);
  const [messagesError, setMessagesError] = useState(null);
  const [sendMessageError, setSendMessageError] = useState(null);
  const [newMessage, setNewMessage] = useState(null);
  const [socket, setSocket] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [allUsers, setAllUsers] = useState(null);

  //init socket
  useEffect(() => {
    const newSocket = io("http://127.0.0.1:3000");
    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, [user]);

  //add online user

  useEffect(() => {
    if (socket === null) return;
    socket.emit("addNewUser", user?._id);

    socket.on("getOnlineUsers", (res) => {
      setOnlineUsers(res);
    });

    return () => {
      socket.off("getOnlineUsers");
    };
  }, [socket]);

  //sendMessage
  useEffect(() => {
    if (socket === null) return;

    const recipientId = currentChat?.members?.filter((id) => id !== user?._id);

    socket.emit("sendMessage", { ...newMessage, recipientId });
  }, [newMessage]);

  //receive message adn notification
  useEffect(() => {
    if (socket === null) return;

    socket.on("getMessage", (res) => {
      if (currentChat?._id !== res.chatId) return;

      setMessages((prev) => [...prev, res]);
    });

    socket.on("getNotification", (res) => {
      const isChatOpen = currentChat?.members.some((id) => id === res.senderId);
      if (isChatOpen) {
        setNotifications((prev) => [{ ...res, isRead: true }, ...prev]);
      } else {
        setNotifications((prev) => [res, ...prev]);
      }
    });

    return () => {
      socket.off("getMessage");
      socket.off("getNotification");
    };
  }, [socket, currentChat]);

  //get users
  useEffect(() => {
    const getUsers = async () => {
      const response = await getRequest(`${baseUrl}/users`);
      if (response.error) {
        return console.log("error fetching users", response);
      }

      const pChats = response.filter((u) => {
        let isChatCreated = false;
        if (user?._id === u._id) return false;

        if (userChats) {
          isChatCreated = userChats?.some((chat) => {
            return chat.members.includes(u?._id);
          });
        }
        return !isChatCreated;
      });
      setPotentialChats(pChats);
      setAllUsers(response);
    };

    getUsers();
  }, [userChats]);

  //get userChat
  useEffect(() => {
    const getUserChats = async () => {
      if (user?._id) {
        setIsUserChatsLoading(true);
        setUserChatsError(null);

        const response = await getRequest(`${baseUrl}/chats/${user?._id}`);

        setIsUserChatsLoading(false);
        if (response.error) {
          return setUserChatsError(response);
        }

        setUserChats(response);
      }
    };

    getUserChats();
  }, [user]);

  useEffect(() => {
    const getMessages = async () => {
      setIsMessageLoading(true);
      setMessagesError(null);

      const response = await getRequest(
        `${baseUrl}/messages/${currentChat?._id}`
      );

      setIsMessageLoading(false);
      if (response.error) {
        return setMessagesError(response);
      }

      setMessages(response);
    };

    getMessages();
  }, [currentChat]);

  const sendTextMessage = useCallback(
    async (text, senderId, chatId, setTextMessage) => {
      if (!text) return console.log("Bạn nên nhập gì đó...");

      const response = await postRequest(
        `${baseUrl}/messages`,
        JSON.stringify({
          chatId,
          senderId,
          text,
        })
      );

      if (response.error) {
        return setSendMessageError(response);
      }

      setNewMessage(response);
      setMessages((prev) => [...prev, response]);
      setTextMessage("");
    },
    []
  );

  const updateCurrentChat = useCallback((chat) => {
    setCurrentChat(chat);
  }, []);

  const createChat = useCallback(async (firstId, secondId) => {
    const response = await postRequest(
      `${baseUrl}/chats`,
      JSON.stringify({
        firstId,
        secondId,
      })
    );
    if (response.error) {
      return console.log("Error creating chat", response);
    }

    setUserChats((prev) => [...prev, response]);
  }, []);

  const readAllNotify = useCallback((notifications) => {
    const readNotify = notifications.map((n) => {
      return { ...n, isRead: true };
    });
    setNotifications(readNotify);
  }, []);

  const showNotificationAsRead = useCallback(
    (n, userChats, user, notifications) => {
      const desiredChat = userChats.find((chat) => {
        const chatMembers = [user._id, n.senderId];
        const isDesiredChat = chat?.members.every((member) => {
          return chatMembers.includes(member);
        });
        return isDesiredChat;
      });
      const readNotify = notifications.map((el) => {
        if (n.senderId === el.senderId) {
          return { ...n, isRead: true };
        } else {
          return el;
        }
      });

      updateCurrentChat(desiredChat);
      setNotifications(readNotify);
    },
    [user]
  );

  const readThisUserNotify = useCallback((thisUserNotify, notifications) => {
    const readNotify = notifications.map((el) => {
      let notification;

      thisUserNotify.forEach((n) => {
        if (n.senderId === el.senderId) {
          notification = { ...n, isRead: true };
        } else {
          notification = el;
        }
      });
      return notification
    });
    setNotifications(readNotify)
  }, []);

  //save group chat

  const createGroupChat = useCallback(async (groupChatName, selectedUsers, user, setShowModal) => {
    const response = await postRequest(
      `${baseUrl}/chats/createGroupChat`,
      JSON.stringify({
        name: groupChatName,
        users: JSON.stringify(selectedUsers.map(u => u?._id)),
        admin_id: user?._id
      })
    );
    if (response.error) {
      return console.log("Error creating chat", response);
    }

    setUserChats((prev) => [...prev, response]);
    setShowModal(false);
  }, []);

  return (
    <ChatContext.Provider
      value={{
        userChats,
        isUserChatsLoading,
        userChatsError,
        potentialChats,
        createChat,
        updateCurrentChat,
        currentChat,
        messages,
        isMessageLoading,
        messagesError,
        sendTextMessage,
        onlineUsers,
        notifications,
        allUsers,
        readAllNotify,
        showNotificationAsRead,
        readThisUserNotify,
        createGroupChat
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};
