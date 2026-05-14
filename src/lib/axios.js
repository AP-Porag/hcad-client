import axios from "axios";
import {API_BASE_URL} from "@/config/api.js";

const axiosInstance = axios.create({
    baseURL: `${API_BASE_URL}`,
});

axiosInstance.interceptors.request.use(
    (config) => {
        const token =
            localStorage.getItem(
                "access_token"
            );

        if (token) {
            config.headers.Authorization =
                `Bearer ${token}`;
        }

        return config;
    }
);

export default axiosInstance;


// Replace All axios Imports
//
// Instead of:
//
//     import axios from "axios";
//
// Use:
//
//     import axios from "@/lib/axios";
