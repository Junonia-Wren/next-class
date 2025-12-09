import api from "./axiosConfig";
import LocalStorage from "./LocalStorage";
import SyncQueue from "./SyncQueue";

const COLLECTION = "subjects";
const ID_KEY = "id";

const SubjectService = {

    // ============================================================
    // GET ALL
    // ============================================================
    async getAll() {
        try {
            const res = await api.get("/subjects/getAll");
            LocalStorage.save(COLLECTION, res.data.data);
            return res;
        } catch (error) {
            console.warn("Backend no disponible, cargando subjects offline");
            return { data: { data: LocalStorage.get(COLLECTION) } };
        }
    },

    // ============================================================
    // GET ONE
    // ============================================================
    async getOne(id) {
        try {
            return await api.get(`/subjects/getOne/${id}`);
        } catch (error) {
            console.warn("Sin conexión. Buscando subject local...");
            const all = LocalStorage.get(COLLECTION);
            const item = all.find(sub => sub[ID_KEY] === id);
            return { data: { data: item || null } };
        }
    },

    // ============================================================
    // CREATE
    // ============================================================
    async create(data) {
        try {
            const res = await api.post("/subjects/create", data);
            LocalStorage.add(COLLECTION, data);
            return res;
        } catch (error) {
            console.warn("Creación offline de subject");

            LocalStorage.add(COLLECTION, data);

            SyncQueue.addOperation({
                service: COLLECTION,
                type: "insert",
                idKey: ID_KEY,
                payload: data
            });

            return { data: { msg: "Materia guardada localmente (offline)" } };
        }
    },

    // ============================================================
    // UPDATE
    // ============================================================
    async update(id, data) {
        try {
            const res = await api.put(`/subjects/update/${id}`, data);
            LocalStorage.update(COLLECTION, ID_KEY, id, data);
            return res;
        } catch (error) {
            console.warn("Actualización offline de subject");

            LocalStorage.update(COLLECTION, ID_KEY, id, data);

            SyncQueue.addOperation({
                service: COLLECTION,
                type: "update",
                idKey: ID_KEY,
                idValue: id,
                payload: data
            });

            return { data: { msg: "Materia actualizada localmente (offline)" } };
        }
    },

    // ============================================================
    // DELETE
    // ============================================================
    async delete(id) {
        try {
            const res = await api.delete(`/subjects/delete/${id}`);
            LocalStorage.delete(COLLECTION, ID_KEY, id);
            return res;
        } catch (error) {
            console.warn("Eliminación offline de subject");

            LocalStorage.delete(COLLECTION, ID_KEY, id);

            SyncQueue.addOperation({
                service: COLLECTION,
                type: "delete",
                idKey: ID_KEY,
                idValue: id
            });

            return { data: { msg: "Materia eliminada localmente (offline)" } };
        }
    }
};

export default SubjectService;
