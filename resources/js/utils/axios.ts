import axios from 'axios';
import Cookies from 'js-cookie';

const axiosClient = axios.create({
    baseURL: 'http://localhost:8000/api',
    timeout: 10000,
    //   withCredentials: true,
    //   withXSRFToken: true,
    // headers: {
    //     Accept: 'application/json',
    //     'Content-Type': 'application/json',
    // },
});

axiosClient.interceptors.request.use(
    (config) => {
        const token = Cookies.get('authToken');
        if (token && config.headers) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

axiosClient.interceptors.response.use((response) => {
    return response
}, (error) => {
    const { response } = error;
    if (response.status === 401) {
        Cookies.remove('authToken');
    }

    throw error;
})


export default axiosClient;