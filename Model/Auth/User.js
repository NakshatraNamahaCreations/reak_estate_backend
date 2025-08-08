const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  userName: { type: String, required: true },
  phonenumber: { type: Number, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  gender: { type: String },
  professional: { type: String },
  socialmedialink: { type: String },
});

const User = mongoose.model("User", UserSchema);
module.exports = User;
