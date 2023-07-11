import axios from "axios";

const feedbackApi  = axios.create({
    baseURL: "http://localhost:8080/v1/feedback?"
});

export default feedbackApi ;