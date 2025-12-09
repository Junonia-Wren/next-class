import api from "./axiosConfig";
import LocalStorage from "./LocalStorage";
import SyncQueue from "./SyncQueue";

const COLLECTION = "schedules";
const ID_KEY = "id";

const ScheduleService = {

    // ============================================================
    // GET ALL
    // ============================================================
    async getAll() {
        try {
            const res = await api.get("/schedules/getAll");
            LocalStorage.save(COLLECTION, res.data.data);
            return res;
        } catch (error) {
            console.warn("Backend no disponible, cargando horarios offline");
            return { data: { data: LocalStorage.get(COLLECTION) } };
        }
    },

    // ============================================================
    // GET ONE
    // ============================================================
    async getOne(id) {
        try {
            return await api.get(`/schedules/getOne/${id}`);
        } catch (error) {
            console.warn("Sin conexión. Buscando horario local...");
            const all = LocalStorage.get(COLLECTION);
            const item = all.find(h => h[ID_KEY] === id);
            return { data: { data: item || null } };
        }
    },

    // ============================================================
    // CREATE
    // ============================================================
    async create(data) {
        try {
            const res = await api.post("/schedules/insertSchedule", data);
            LocalStorage.add(COLLECTION, data);
            return res;
        } catch (error) {
            console.warn("Creación offline de horario");

            LocalStorage.add(COLLECTION, data);

            SyncQueue.addOperation({
                service: COLLECTION,
                type: "insert",
                idKey: ID_KEY,
                payload: data
            });

            return { data: { msg: "Horario guardado localmente (offline)" } };
        }
    },

    // ============================================================
    // UPDATE
    // ============================================================
    async update(scheduleId, data) {
        try {
            const res = await api.put(`/schedules/updateSchedule/${scheduleId}`, data);
            LocalStorage.update(COLLECTION, ID_KEY, scheduleId, data);
            return res;
        } catch (error) {
            console.warn("Actualización offline de horario");

            LocalStorage.update(COLLECTION, ID_KEY, scheduleId, data);

            SyncQueue.addOperation({
                service: COLLECTION,
                type: "update",
                idKey: ID_KEY,
                idValue: scheduleId,
                payload: data
            });

            return { data: { msg: "Horario actualizado localmente (offline)" } };
        }
    },

    // ============================================================
    // DELETE
    // ============================================================
    async delete(scheduleId) {
        try {
            const res = await api.delete(`/schedules/deleteSchedule/${scheduleId}`);
            LocalStorage.delete(COLLECTION, ID_KEY, scheduleId);
            return res;
        } catch (error) {
            console.warn("Eliminación offline de horario");

            LocalStorage.delete(COLLECTION, ID_KEY, scheduleId);

            SyncQueue.addOperation({
                service: COLLECTION,
                type: "delete",
                idKey: ID_KEY,
                idValue: scheduleId
            });

            return { data: { msg: "Horario eliminado localmente (offline)" } };
        }
    },

    // ============================================================
    // GET HORARIO ALUMNO (solo online)
    // ============================================================
    async getHorarioAlumno(matricula) {
        try {
            return await api.get(`/schedules/getHorarioAlumno/${matricula}`);
        } catch (error) {
            return { data: { msg: "No disponible offline" } };
        }
    }
};

export default ScheduleService;
