const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const userRoute = require("./Routes/userRoute");
const chatRoute = require("./Routes/chatRoute")
const messageRoute = require("./Routes/messageRoute")
dotenv.config();
const app = express();

app.use(express.json());
app.use(cors());
app.use("/api/users", userRoute);
app.use("/api/chats", chatRoute);
app.use("/api/messages", messageRoute);

app.get("/", (req, res) => {
  res.send("Welcome our chat app APIs...");
});

const port = process.env.port || 5000;
const uri = process.env.ATLAS_URI;
app.listen(port, (req, res) => {
  console.log(`Server running on port: ${port}`);
});

mongoose
  .connect(uri)
  .then(() => console.log("MongoDB connect"))
  .catch((error) => console.log("MongoDB connection failed: ", error.message));
