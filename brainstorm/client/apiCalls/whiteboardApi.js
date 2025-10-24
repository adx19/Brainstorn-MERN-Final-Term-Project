import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL+"/api/whiteboard";

export const getBoards = async () => {
  const res = await axios.get(`${BASE_URL}/all`, { withCredentials: true });
  return res.data;
};

export const saveBoard = async (boardData) => {
  const res = await axios.post(`${BASE_URL}/save`, boardData, { withCredentials: true });
  return res.data;
};

export const updateBoardStatus = async (id, status) => {
  const res = await axios.patch(`${BASE_URL}/${id}/status`, { status }, { withCredentials: true });
  return res.data;
};

export const deleteBoard = async (id) => {
  const res = await axios.delete(`${BASE_URL}/${id}`, { withCredentials: true });
  return res.data;
};
