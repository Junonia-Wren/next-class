import api from "./axiosConfig";

const SubjectService = {
    // CORREGIDO: Agregamos la 's' en todas las rutas para coincidir con app.js
    
    getAll: () => api.get("/subjects/getAll"),
    getOne: (id) => api.get(`/subjects/getOne/${id}`),

    create: (data) => api.post("/subjects/create", data),
    update: (id, data) => api.put(`/subjects/update/${id}`, data),
    delete: (id) => api.delete(`/subjects/delete/${id}`),
};

export default SubjectService;