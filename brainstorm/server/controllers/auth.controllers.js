import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const signup = async (req, res) => {
  const { name, username, email, password } = req.body;
  if (!name || !username || !email || !password) {
    return res.status(400).json({ msg: "Please enter all required fields" });
  }

  if (password.length < 6)
    return res
      .status(400)
      .json({ msg: "Password must be at least 6 characters long" });

  const existingUserEmail = await User.findOne({ email });
  const existingUsername = await User.findOne({ username });
  if (existingUserEmail)
    return res.status(400).json({ msg: "Email already exists" });
  if (existingUsername)
    return res.status(400).json({ msg: "Username already taken" });

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  const newUser = await User.create({
    name,
    username,
    email,
    password: hashedPassword,
  });

  res.status(201).json({ user: { id: newUser._id, name, username } });
};

export const login = async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password)
      return res.status(400).json({ msg: "Please enter all required fields" });

    const existingUser = await User.findOne({ username });
    if (!existingUser)
      return res
        .status(400)
        .json({ msg: "User with this username does not exist" });

    const isMatching = await bcrypt.compare(password, existingUser.password);
    if (!isMatching) return res.status(400).json({ msg: "Incorrect password" });

    // Generate JWT
    const token = jwt.sign(
      { id: existingUser._id, username: existingUser.username },
      process.env.JWT_SECRET,
      { expiresIn: "7d" } // optional expiry
    );
    // Send JWT as httpOnly cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // must be HTTPS in prod
      sameSite: "none", // allow cross-origin requests
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    });
    res.status(200).json({ user: existingUser });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ msg: "Internal Server Error" });
  }
};
