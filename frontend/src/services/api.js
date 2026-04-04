import axios from "axios";

const API = axios.create({
  baseURL: "https://smart-library-seat-reservation-system.onrender.com/api"
});

export default API;
