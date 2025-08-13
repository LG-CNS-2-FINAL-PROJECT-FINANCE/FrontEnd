import axios from "axios";

// Axios 인스턴스 생성
const instance = axios.create({
  baseURL:
    "http://192.168.0.222:8080/api",
  withCredentials: true,
});

export default instance;