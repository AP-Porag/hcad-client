import axios from "axios";
import {API_BASE_URL} from "@/config/api.js";

const API_URL = `${API_BASE_URL}/users`;

export const getUsers = async () => {
    const response = await axios.get(API_URL);
    return response.data;
};

export const getUser = async (id) => {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data;
};

export const createUser = async (payload) => {
    const response = await axios.post(API_URL, payload);
    return response.data;
};

export const updateUser = async (id, payload) => {
    const response = await axios.patch(`${API_URL}/${id}`, payload);
    return response.data;
};

export const deleteUser = async (id) => {
    const response = await axios.delete(`${API_URL}/${id}`);
    return response.data;
};
