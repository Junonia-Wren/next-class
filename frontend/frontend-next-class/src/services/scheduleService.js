// services/schedule.service.js
import api from "./axiosConfig";

const ScheduleService = {

    // -------------------------
    // CONSULTAS
    // -------------------------

    getAll() {
        return api.get("/schedule/getAll");
    },

    getOne(id) {
        return api.get(`/schedule/getOne/${id}`);
    },

    getByGroupName(name) {
        return api.get(`/schedule/getByGrupoName?name=${name}`);
    },

    getHorarioAlumno(matricula) {
        return api.get(`/schedule/getHorarioAlumno/${matricula}`);
    },

    // -------------------------
    // CRUD ADMIN (TOKEN)
    // -------------------------

    insert(data) {
        return api.post("/schedule/insertSchedule", data);
    },

    update(id, data) {
        return api.put(`/schedule/updateSchedule/${id}`, data);
    },

    delete(id) {
        return api.delete(`/schedule/deleteSchedule/${id}`);
    }
};

export default ScheduleService;
