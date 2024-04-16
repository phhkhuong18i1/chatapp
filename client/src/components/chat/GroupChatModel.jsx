import React, { useContext, useState } from "react";
import { Modal, Button, Form, Stack } from "react-bootstrap";
import { AuthContext } from "../../context/AuthContext";
import { ChatContext } from "../../context/ChatContext";
import UserListItem from "../user/UserListItem";
import UserBadgeItem from "../user/UserBadgeItem";

const GroupChatModel = ({ children }) => {
  const [showModal, setShowModal] = useState(false);
  const [groupChatName, setGroupChatName] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [search, setSearch] = useState("");

  const { user, updateSearch, loadingSearch, searchResult } =
    useContext(AuthContext);

  const { createGroupChat } = useContext(ChatContext);
  const handleGroup = (u) => {
    if (selectedUsers.includes(u)) {
      return;
    }

    setSelectedUsers([...selectedUsers, u]);
  };

  const handleDelete = (u) => {
    setSelectedUsers(selectedUsers.filter((user) => user._id !== u?._id));
  };

  return (
    <>
      <div className="align-self-end" onClick={() => setShowModal(!showModal)}>
        {children}
      </div>
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header>
          <Modal.Title className="text-black text-center flex-grow-1">
            Tạo group chat
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-black d-flex flex-column  ">
          <Form.Control
            value={groupChatName}
            onChange={(e) => setGroupChatName(e.target.value)}
            placeholder="Tên group"
          ></Form.Control>
          <Form.Control
            className="mt-2"
            onChange={(e) => updateSearch(e.target.value)}
            placeholder="Thêm user"
          ></Form.Control>
          <Stack className="d-flex m-2 flex-row" gap={2}>
            {selectedUsers?.map((u) => (
              <UserBadgeItem
                key={u?._id}
                user={u}
                handleFunction={() => handleDelete(u)}
              />
            ))}
          </Stack>

          {loadingSearch ? (
            <div>loading</div>
          ) : (
            searchResult
              ?.slice(0, 4)
              .map((u) => (
                <UserListItem
                  key={u?._id}
                  user={u}
                  handleFunction={() => handleGroup(u)}
                />
              ))
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button
            className="btn-primary"
            onClick={() => {
              createGroupChat(groupChatName, selectedUsers, user, setShowModal);
            }}
          >
            Tạo
          </Button>
          <Button className="btn-secondary" onClick={() => setShowModal(false)}>
            Đóng
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default GroupChatModel;
