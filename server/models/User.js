const mongoose = require("mongoose");

const User = new mongoose.Schema(
  {
    username: { type: String, required: true },
    password: { type: String, required: true },
    lastLogin: { type: Date },
    lastLogout: { type: Date },
  },
  { collection: "user-data" }
);

const model = mongoose.model("UserData", User);

module.exports = model;
