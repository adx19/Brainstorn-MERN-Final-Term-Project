import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },

  username: {
    type: String,
    required: true,
  },

  email: {
    type: String,
    required: true,
    unique: true,
  },

  password: {
    type: String,
    required: true,
  },

  ismale: {
    type: Boolean,
  },

  phonenumber: {
    type: Number,
  },

  profilepic: {
    type: String,
    default: ''
  },

  teams: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "team",
    }
  ],
  friends: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user"
    }
  ],

  savedBoards: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "board"
    }
  ],

  ongoingBoards: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "board"
    }
  ],
  completedBoards: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "board"
    }
  ],


}, {
  timestamps: true,
});

const User = mongoose.model("user", userSchema);

export default User;
