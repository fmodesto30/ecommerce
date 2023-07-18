import axios from "axios";

const checkTokenApi  = axios.create({
    baseURL: "http://localhost:8080/v1/checkToken"
});

export default checkTokenApi ;