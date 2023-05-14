import axios from "axios";

const baseURL = "/api/";
// const baseURL = "https://chit-chat-fredb9yzp-afaq911.vercel.app/api/";

export const axiosinstance = axios.create({
  baseURL: baseURL,
});
