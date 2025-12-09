import api from "./axiosConfig";
import LocalStorage from "./LocalStorage";
import SyncQueue from "./SyncQueue";

const COLLECTION = "groups";   // LocalStorage key
const ID_KEY = "id";           // identificador único para grupos

const GroupService = {

    // ============================================================
    // GET ALL
    // ============================================================
    async getAll() {
        try {
            const res = await api.get("/groups/getAll");
            LocalStorage.save(COLLECTION, res.data.data);
            return res;
        } catch (error) {
            console.warn(" Backend no disponible, cargando grupos offline");
            return { data: { data: LocalStorage.get(COLLECTION) } };
        }
    },

    // ============================================================
    // GET AREAS (solo online)
    // ============================================================
    async getAreas() {
        try {
            return await api.get("/groups/areas");
        } catch (error) {
            console.warn(" No disponible offline: areas");
            return { data: { msg: "Sin conexión" } };
        }
    },

    // ============================================================
    // CREATE GROUP
    // ============================================================
    async create(data) {
        try {
            const res = await api.post("/groups/create", data);
            LocalStorage.add(COLLECTION, data);
            return res;

        } catch (error) {
            console.warn("⚠ Creación offline de grupo");

            LocalStorage.add(COLLECTION, data);

            SyncQueue.addOperation({
                service: COLLECTION,
                type: "insert",
                idKey: ID_KEY,
                payload: data
            });

            return { data: { msg: "Grupo guardado localmente (offline)" } };
        }
    },

    // ============================================================
    // UPDATE GROUP
    // ============================================================
    async update(id, data) {
        try {
            const res = await api.put(`/groups/update/${id}`, data);
            LocalStorage.update(COLLECTION, ID_KEY, id, data);
            return res;

        } catch (error) {
            console.warn("⚠ Actualización offline de grupo");

            LocalStorage.update(COLLECTION, ID_KEY, id, data);

            SyncQueue.addOperation({
                service: COLLECTION,
                type: "update",
                idKey: ID_KEY,
                idValue: id,
                payload: data
            });

            return { data: { msg: "Grupo actualizado localmente (offline)" } };
        }
    },

    // ============================================================
    // DELETE GROUP
    // ============================================================
    async delete(id) {
        try {
            const res = await api.delete(`/groups/delete/${id}`);
            LocalStorage.delete(COLLECTION, ID_KEY, id);
            return res;

        } catch (error) {
            console.warn("⚠ Eliminación offline de grupo");

            LocalStorage.delete(COLLECTION, ID_KEY, id);

            SyncQueue.addOperation({
                service: COLLECTION,
                type: "delete",
                idKey: ID_KEY,
                idValue: id
            });

            return { data: { msg: "Grupo eliminado localmente (offline)" } };
        }
    },

    // ============================================================
    // GET ONE WITH STUDENTS
    // ============================================================
    async getOneWithStudents(id) {
        try {
            return await api.get(`/groups/getOne/${id}`);
        } catch (error) {
            console.warn("⚠ Sin conexión. Buscar en LocalStorage…");

            const all = LocalStorage.get(COLLECTION);
            const group = all.find(g => g.id === id);

            return { data: { data: group || null } };
        }
    },

    // ============================================================
    // TOGGLE ROLE (solo online)
    // ============================================================
    async toggleRole(userId) {
        try {
            return await api.post("/groups/toggleRole", { userId });
        } catch (error) {
            return { data: { msg: "No disponible offline" } };
        }
    },

    // ============================================================
    // REMOVE STUDENT (solo online)
    // ============================================================
    async removeStudent(groupId, userId) {
        try {
            return await api.post("/groups/removeStudent", { groupId, userId });
        } catch (error) {
            return { data: { msg: "No disponible offline" } };
        }
    },

    // ============================================================
    // UPDATE STUDENT (solo online)
    // ============================================================
    async updateStudent(studentId, data) {
        try {
            return await api.put("/groups/updateStudent", { studentId, ...data });
        } catch (error) {
            return { data: { msg: "No disponible offline" } };
        }
    }
};

export default GroupService;
