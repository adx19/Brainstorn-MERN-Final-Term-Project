import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
export const signup = async(req, res) => {
  const {name, username, email, password} = req.body;

  if(!name || !username || !email || !password) {
    return res.status(400).json({msg: "Please enter all required fields"});
  }

  if(password.length < 6) {
    return res.status(400).json({msg: "Password must be at least 6 characters long"});
  }

  const existinguseremail = await User.findOne({email});
  const existingusername = await User.findOne({username});

  if(existinguseremail) {
    return res.status(400).json({msg: "User with this email already exists"});
  }
  if(existingusername) {
    return res.status(400).json({msg: "Username already taken"});
  }

  const salt = await bcrypt.genSalt(10);
  const hashedpassword = await bcrypt.hash(password, salt);




  await User.create({name, username, email, password: hashedpassword})
  res.status(201).json({message: "User created successfully"});
}

export const login = async (req, res) => {
  const {username, password} = req.body;
  if(!username || !password) {
    return res.status(400).json({msg: "Please enter all required fields"});
  }
  const existinguser = User.findOne({username});
  if(!existinguser) {
    return res.status(400).json({msg: "User with this username does not exist"});
  }
  const ismatching = await bcrypt.compare(password, existinguser[0].password);
  if(!ismatching) {
    return res.status(400).json({msg: "Incorrect password"});
  }

  res.status(200).json({message: "User logged in successfully"});
}