import axios from "axios";
import { API_BASE_URL } from "@/config/api";

export const getProperties = async (params = {}) => {
    const response = await axios.get(
        `${API_BASE_URL}/properties`,
        {
            params,
            timeout: 300000, // 5 minutes
        }
    );

    return response.data;
};
