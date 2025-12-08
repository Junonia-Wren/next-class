// src/services/groupService.js
import api from "./axiosConfig";

const groupService = {
    getAll() {
        return api.get("/groups/getAll");
    },

    getOne(id) {
        return api.get(`/groups/getOne/${id}`);
    },

    create(data) {
        return api.post("/groups/create", data);
    },

    update(id, data) {
        return api.put(`/groups/update/${id}`, data);
    },

    delete(id) {
        return api.delete(`/groups/delete/${id}`);
    }
};

export default groupService;
