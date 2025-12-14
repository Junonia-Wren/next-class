import api from "./axiosConfig";

const GroupService = {
    // --- CRUD DE GRUPOS ---
    getAll: () => api.get("/groups/getAll"),
    // NUEVO: Obtener áreas públicas
    getAreas: () => api.get("/groups/areas"),
    create: (data) => api.post("/groups/create", data),
    
    // AQUÍ ESTABA EL POSIBLE ERROR: Asegúrate de tener esta línea
    update: (id, data) => api.put(`/groups/update/${id}`, data),
    
    delete: (id) => api.delete(`/groups/delete/${id}`),
    
    // --- GESTIÓN DE ALUMNOS ---
    getOneWithStudents: (id) => api.get(`/groups/getOne/${id}`),
    toggleRole: (userId) => api.post("/groups/toggleRole", { userId }),
    removeStudent: (groupId, userId) => api.post("/groups/removeStudent", { groupId, userId }),
    
    // NUEVO: Para guardar los cambios del modal pequeño de alumno
    updateStudent: (studentId, data) => api.put("/groups/updateStudent", { studentId, ...data })
};

export default GroupService;