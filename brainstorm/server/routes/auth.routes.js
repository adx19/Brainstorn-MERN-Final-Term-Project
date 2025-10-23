import express from 'express';
import { signup,login } from '../controllers/auth.controllers.js';
const authrouter = express.Router();

authrouter.post('/signup', signup);
authrouter.post('/login', login);

export default authrouter;