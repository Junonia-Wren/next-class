import api from "./axiosConfig";

const adminService = {
    getLeader(grupo) {
        return api.get(`/admin/getLeaderByGrupo/${grupo}`);
    },

    getStudents(grupo) {
        return api.get(`/admin/getStudentsByGrupo/${grupo}`);
    },

    getTeachers() {
        return api.get("/admin/teachers");
    },

    setLeader(matricula) {
        return api.post(`/admin/setLeader/${matricula}`);
    },

    deleteLeader(matricula) {
        return api.delete(`/admin/deleteJefe/${matricula}`);
    },

    updateLeader(matricula, data) {
        return api.put(`/admin/updateJefe/${matricula}`, data);
    }
};

export default adminService;
