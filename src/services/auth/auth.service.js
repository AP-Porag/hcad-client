import axios from "axios";
import {API_BASE_URL} from "@/config/api.js";

const API_URL = `${API_BASE_URL}/auth`;

export const loginUser = async (payload) => {
    const response = await axios.post(
        `${API_URL}/login`,
        payload
    );

    return response.data;
};
