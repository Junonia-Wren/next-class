import api from "./axiosConfig";

const SubjectService = {
    getAll: () => api.get("/subject/getAll"),
    getOne: (id) => api.get(`/subject/getOne/${id}`),

    create: (data) => api.post("/subject/create", data),
    update: (id, data) => api.put(`/subject/update/${id}`, data),
    delete: (id) => api.delete(`/subject/delete/${id}`),
};

export default SubjectService;
