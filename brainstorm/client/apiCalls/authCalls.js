import axios from "axios";
import { API_BASE_URL } from "./config";



const API = axios.create({
  baseURL: API_BASE_URL + "/api", 
  withCredentials: true,// assuming your routes start with /api
});

// Signup API call
export const signup = async (userData) => {
  try {
    const res = await API.post("/auth/signup", userData);
    return res.data;
  } catch (error) {
    throw error.response?.data || { msg: "Signup failed" };
  }
};

// Login API call
export const login = async (credentials) => {
  try {
    const res = await API.post("/auth/login", credentials);
    return res.data;
  } catch (error) {
    throw error.response?.data || { msg: "Login failed" };
  }
};