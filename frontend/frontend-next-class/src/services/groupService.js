// services/group.service.js
import api from "./axiosConfig";

const GroupService = {

    getAll() {
        return api.get("/groups/getAll");
    },

    getOne(id) {
        return api.get(`/groups/getOne/${id}`);
    },

    getByName(name) {
        return api.get(`/groups/getByName/${name}`);
    }
};

export default GroupService;
