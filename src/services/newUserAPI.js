import axios from "axios";

const newUserApi  = axios.create({
    baseURL: "http://localhost:8080/v1/new"
});

export default newUserApi ;