import axios from "axios";

const API_URL = "http://localhost:3001/api";



const getPrice = async (symbol) => {
  const res = await axios.get(`${API_URL}/prices/${symbol}`);
  return res.data;
};

const getHistory = async () => {
  const res = await axios.get(`${API_URL}/history`);
  return res.data;
};

export default { getPrice, getHistory };
