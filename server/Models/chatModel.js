const mongoose = require("mongoose");

const chatSchema = new mongoose.Schema(
  {
    name: {type: String, required: false},
    members: Array,
    admin_id: {type: String, required: false}
  },
  {
    timestamps: true,
  }
);

const chatModel = mongoose.model("Chat", chatSchema);

module.exports = chatModel;


