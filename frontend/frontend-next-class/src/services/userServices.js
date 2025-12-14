import api from "./axiosConfig";

const userServices = {
    register(dataUser) {
        return api.post("/auth/register", dataUser);
    },

    login(dataUser) {
        return api.post("/auth/login", dataUser);
    }
};

export default userServices;
