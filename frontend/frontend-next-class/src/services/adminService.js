// services/admin.service.js
import api from "./axiosConfig";

const AdminService = {
    getDashboardStats: () => api.get("/admin/dashboard-stats"),
    
    // Obtener todos los jefes de grupo
    getAllLeaders() {
        return api.get("/admin/getAllLeaders");
    },

    // Obtener jefe de grupo por id de grupo
    getLeaderByGroup(grupoId) {
        return api.get(`/admin/getLeaderByGrupo/${grupoId}`);
    },

    // Asignar un nuevo jefe de grupo
    asignarJefe(matricula, grupo) {
        return api.post("/admin/asignarJefe", { matricula, grupo });
    },

    // Actualizar jefe de grupo
    updateJefe(matricula, data) {
        return api.put(`/admin/updateJefe/${matricula}`, data);
    },

    // Eliminar jefe de grupo
    deleteJefe(matricula) {
        return api.delete(`/admin/deleteJefe/${matricula}`);
    }
};

export default AdminService;
