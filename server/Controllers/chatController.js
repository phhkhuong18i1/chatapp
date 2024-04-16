const chatModel = require("../Models/chatModel");

const createChat = async (req, res) => {
  const { firstId, secondId } = req.body;

  try {
    const chat = await chatModel.findOne({
      members: { $all: [firstId, secondId] },
    });

    if (chat) return res.status(200).json(chat);

    const newChat = new chatModel({
      members: [firstId, secondId],
    });

    const response = await newChat.save();

    res.status(200).json(response);
  } catch (error) {
    console.log(error);

    res.status(500).json(error);
  }
};

const createGroupChat = async (req, res) => {
  const users = JSON.parse(req.body.users);

  
  try {

    const chat = await chatModel.findOne({
      members: { $all: users },
    });
  
    if (chat) return res.status(200).json(chat);
    
    const newChat = new chatModel({
      members: users,
      name: req.body.name,
      admin_id: req.body.admin_id
    });

    const response = await newChat.save();

    res.status(200).json(response);
  } catch (error) {
    console.log(error);

    res.status(500).json(error);
  }
};

const findUserChats = async (req, res) => {
  const userId = req.params.userId;

  try {
    const chats = await chatModel.find({
      members: { $in: [userId] },
    });

    res.status(200).json(chats);
  } catch (error) {}
};

const findChat = async (req, res) => {
  const { firstId, secondId } = req.body;

  try {
    const chat = await chatModel.find({
      members: { $all: [firstId, secondId] },
    });

    res.status(200).json(chat);
  } catch (error) {}
};

module.exports = { createChat, findUserChats, findChat, createGroupChat };
