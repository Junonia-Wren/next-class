import api from "./axiosConfig";

const SubjectService = {
    getAll: () => api.get("/subjects/getAll"),
    getOne: (id) => api.get(`/subjects/getOne/${id}`),

    create: (data) => api.post("/subjects/create", data),
    update: (id, data) => api.put(`/subjects/update/${id}`, data),
    delete: (id) => api.delete(`/subjects/delete/${id}`),
};

export default SubjectService;
