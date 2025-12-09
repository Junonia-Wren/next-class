import api from "./axiosConfig";
import LocalStorage from "./LocalStorage";
import SyncQueue from "./SyncQueue";

const COLLECTION = "tasks";
const ID_KEY = "id";

const TaskService = {

    // ============================================================
    // GET BY GROUP
    // ============================================================
    async getByGrupo() {
        try {
            const res = await api.get("/tasks/getByGrupo");
            LocalStorage.save(COLLECTION, res.data.data);
            return res;
        } catch (error) {
            console.warn("Backend no disponible, cargando tasks offline");
            return { data: { data: LocalStorage.get(COLLECTION) } };
        }
    },

    // ============================================================
    // CREATE TASK
    // ============================================================
    async create(data) {
        try {
            const res = await api.post("/tasks/insertTask", data);
            LocalStorage.add(COLLECTION, data);
            return res;
        } catch (error) {
            console.warn("Creación offline de tarea");

            LocalStorage.add(COLLECTION, data);

            SyncQueue.addOperation({
                service: COLLECTION,
                type: "insert",
                idKey: ID_KEY,
                payload: data
            });

            return { data: { msg: "Tarea guardada localmente (offline)" } };
        }
    },

    // ============================================================
    // UPDATE TASK
    // ============================================================
    async update(id, data) {
        try {
            const res = await api.put(`/tasks/updateTask/${id}`, data);
            LocalStorage.update(COLLECTION, ID_KEY, id, data);
            return res;
        } catch (error) {
            console.warn("Actualización offline de tarea");

            LocalStorage.update(COLLECTION, ID_KEY, id, data);

            SyncQueue.addOperation({
                service: COLLECTION,
                type: "update",
                idKey: ID_KEY,
                idValue: id,
                payload: data
            });

            return { data: { msg: "Tarea actualizada localmente (offline)" } };
        }
    },

    // ============================================================
    // DELETE TASK
    // ============================================================
    async delete(id) {
        try {
            const res = await api.delete(`/tasks/deleteTask/${id}`);
            LocalStorage.delete(COLLECTION, ID_KEY, id);
            return res;
        } catch (error) {
            console.warn("Eliminación offline de tarea");

            LocalStorage.delete(COLLECTION, ID_KEY, id);

            SyncQueue.addOperation({
                service: COLLECTION,
                type: "delete",
                idKey: ID_KEY,
                idValue: id
            });

            return { data: { msg: "Tarea eliminada localmente (offline)" } };
        }
    },

    // ============================================================
    // MARK COMPLETED (solo online)
    // ============================================================
    async markCompleted(id, status) {
        try {
            return await api.put(`/tasks/markCompleted/${id}`, { completed: status });
        } catch (error) {
            console.warn("No disponible offline: marcar completa");
            return { data: { msg: "No disponible offline" } };
        }
    }
};

export default TaskService;
