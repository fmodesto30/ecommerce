import axios from "axios";

const authenticateAPI  = axios.create({
    baseURL: "http://localhost:8080/v1/authenticate"
});

export default authenticateAPI ;