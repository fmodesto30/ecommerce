import axios from 'axios';

const lastProductsApi = axios.create({
    baseURL: 'http://localhost:8080/v1/lastProducts',
});

export default lastProductsApi;