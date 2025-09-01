import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username: String,
  email: { type: String, unique: true },
  password: String,
  joinDate: { type: Date, default: Date.now },
  picture: { type: String }, 
});

const User = mongoose.model("User", userSchema);

export default User;
