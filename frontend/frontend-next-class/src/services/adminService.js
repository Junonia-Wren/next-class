import api from "./axiosConfig";
import LocalStorage from "./LocalStorage";
import SyncQueue from "./SyncQueue";

const COLLECTION = "leaders";   // nombre de la colección en LocalStorage
const ID_KEY = "matricula";     // identificador único

const AdminService = {

    // ============================================================
    // GET ALL LEADERS
    // ============================================================
    async getAllLeaders() {
        try {
            const res = await api.get("/admin/getAllLeaders");
            LocalStorage.save(COLLECTION, res.data.data);
            return res;
        } catch (error) {
            console.warn(" Backend no disponible, cargando leaders offline");
            return { data: { data: LocalStorage.get(COLLECTION) } };
        }
    },

    // ============================================================
    // GET LEADER BY GROUP
    // ============================================================
    async getLeaderByGroup(grupoId) {
        try {
            return await api.get(`/admin/getLeaderByGrupo/${grupoId}`);
        } catch (error) {
            console.warn(" Sin conexión. Buscando en cache local…");

            const all = LocalStorage.get(COLLECTION);
            const leader = all.find(l => l.grupo === grupoId);

            return { data: { data: leader || null } };
        }
    },

    // ============================================================
    // INSERT / ASIGNAR JEFE
    // ============================================================
    async asignarJefe(matricula, grupo) {
        const payload = { matricula, grupo };

        try {
            const res = await api.post("/admin/asignarJefe", payload);
            LocalStorage.add(COLLECTION, payload);
            return res;

        } catch (error) {
            console.warn(" Guardado offline: asignar jefe");

            LocalStorage.add(COLLECTION, payload);

            SyncQueue.addOperation({
                service: COLLECTION,
                type: "insert",
                idKey: ID_KEY,
                payload
            });

            return { data: { msg: "Jefe asignado localmente (offline)" } };
        }
    },

    // ============================================================
    // UPDATE JEFE
    // ============================================================
    async updateJefe(matricula, data) {
        try {
            const res = await api.put(`/admin/updateJefe/${matricula}`, data);
            LocalStorage.update(COLLECTION, ID_KEY, matricula, data);
            return res;

        } catch (error) {
            console.warn("⚠ Actualización offline de líder");

            LocalStorage.update(COLLECTION, ID_KEY, matricula, data);

            SyncQueue.addOperation({
                service: COLLECTION,
                type: "update",
                idKey: ID_KEY,
                idValue: matricula,
                payload: data
            });

            return { data: { msg: "Líder actualizado localmente (offline)" } };
        }
    },

    // ============================================================
    // DELETE JEFE
    // ============================================================
    async deleteJefe(matricula) {
        try {
            const res = await api.delete(`/admin/deleteJefe/${matricula}`);
            LocalStorage.delete(COLLECTION, ID_KEY, matricula);
            return res;

        } catch (error) {
            console.warn(" Eliminación offline de líder");

            LocalStorage.delete(COLLECTION, ID_KEY, matricula);

            SyncQueue.addOperation({
                service: COLLECTION,
                type: "delete",
                idKey: ID_KEY,
                idValue: matricula
            });

            return { data: { msg: "Líder eliminado localmente (offline)" } };
        }
    },

    // ============================================================
    // DASHBOARD STATS (no se cachea)
    // ============================================================
    async getDashboardStats() {
        try {
            return await api.get("/admin/dashboard-stats");
        } catch (err) {
            console.warn(" Dashboard no disponible offline");
            return { data: { msg: "Sin conexión" } };
        }
    }
};

export default AdminService;
