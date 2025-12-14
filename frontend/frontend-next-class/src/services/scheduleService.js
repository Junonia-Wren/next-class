import api from "./axiosConfig";

const ScheduleService = {
    getAll: () => api.get("/schedules/getAll"),
    getOne: (id) => api.get(`/schedules/getOne/${id}`),
    
    // Inserta un nuevo horario
    create: (data) => api.post("/schedules/insertSchedule", data),
    
    // Actualiza por ID del horario (Ojo: tu ruta pide schedule_id)
    update: (scheduleId, data) => api.put(`/schedules/updateSchedule/${scheduleId}`, data),
    
    delete: (scheduleId) => api.delete(`/schedules/deleteSchedule/${scheduleId}`),

    // Funciones extra para alumno
    getHorarioAlumno: (matricula) => api.get(`/schedules/getHorarioAlumno/${matricula}`)
};

export default ScheduleService;