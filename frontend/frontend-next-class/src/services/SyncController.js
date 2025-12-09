import SyncQueue from "./SyncQueue";
import AdminService from "./admin.service";
import GroupService from "./group.service";
import ScheduleService from "./schedule.service";
import SubjectService from "./subject.service";
import TaskService from "./task.service";

// Mapa de servicios para ejecución dinámica
const serviceMap = {
    leaders: AdminService,
    groups: GroupService,
    schedules: ScheduleService,
    subjects: SubjectService,
    tasks: TaskService
};

const SyncController = {

    // Ejecutar todas las operaciones pendientes
    async syncAll() {
        const queue = SyncQueue.getQueue();
        if (queue.length === 0) {
            console.log("No hay operaciones pendientes por sincronizar.");
            return;
        }

        console.log(`Sincronizando ${queue.length} operaciones pendientes...`);

        for (const op of queue) {
            const { service, type, idKey, idValue, payload } = op;
            const serviceInstance = serviceMap[service];

            if (!serviceInstance) {
                console.warn(`Servicio desconocido: ${service}`);
                continue;
            }

            try {
                switch (type) {

                    case "insert":
                        await serviceInstance.create(payload, true);
                        break;

                    case "update":
                        await serviceInstance.update(idValue, payload, true);
                        break;

                    case "delete":
                        await serviceInstance.delete(idValue, true);
                        break;

                    default:
                        console.warn(`Operación desconocida: ${type}`);
                        break;
                }

                console.log(`Operación ${type} en ${service} aplicada correctamente.`);

            } catch (error) {
                console.warn(`Error al sincronizar operación ${type} en ${service}:`, error);
                // Si falla, dejamos la operación en la cola
                continue;
            }
        }

        // Limpiar la cola cuando todo haya terminado
        SyncQueue.clearQueue();
        console.log("Sincronización finalizada. Cola vaciada.");
    },

    // Activa un evento cuando vuelva internet
    listenForConnection() {
        window.addEventListener("online", () => {
            console.log("Conexión restaurada. Ejecutando sincronización...");
            this.syncAll();
        });
    }
};

export default SyncController;
