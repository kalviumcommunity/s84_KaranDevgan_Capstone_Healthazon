import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_RENDER_API,
});

export default API;
