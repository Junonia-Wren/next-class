import api from "./axiosConfig";

const TaskService = {
    // Consulta principal (usa la ruta que definimos arriba)
    getByGrupo: () => api.get("/tasks/getByGrupo"),
    
    // Acciones Jefe
    create: (data) => api.post("/tasks/insertTask", data),
    update: (id, data) => api.put(`/tasks/updateTask/${id}`, data),
    delete: (id) => api.delete(`/tasks/deleteTask/${id}`),
    
    // Acciones Alumno
    markCompleted: (id, status) => api.put(`/tasks/markCompleted/${id}`, { completed: status })
};

export default TaskService;