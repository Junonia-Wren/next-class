// services/schedule.service.js
import api from "./axiosConfig";

const ScheduleService = {
    getAll() {
        return api.get("/schedules/getAll");
    },

    getOne(id) {
        return api.get(`/schedules/getOne/${id}`);
    },

    getByGroupName(name) {
        return api.get(`/schedules/getByGrupoName?name=${name}`);
    },

    getHorarioAlumno(matricula) {
        return api.get(`/schedules/getHorarioAlumno/${matricula}`);
    },

    insert(data) {
        return api.post("/schedules/insertSchedule", data);
    },

    update(id, data) {
        return api.put(`/schedules/updateSchedule/${id}`, data);
    },

    delete(id) {
        return api.delete(`/schedules/deleteSchedule/${id}`);
    }
};

export default ScheduleService;
