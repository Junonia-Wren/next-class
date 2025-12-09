
const QUEUE_KEY = "sync_queue_global";

const SyncQueue = {

    // Obtener cola completa
    getQueue() {
        const raw = localStorage.getItem(QUEUE_KEY);
        return raw ? JSON.parse(raw) : [];
    },

    // Guardar cola completa
    saveQueue(queue) {
        localStorage.setItem(QUEUE_KEY, JSON.stringify(queue));
    },

    // Agregar operación pendiente de sincronizar
    addOperation(operation) {
        const queue = SyncQueue.getQueue();
        queue.push({
            ...operation,
            timestamp: Date.now()
        });
        SyncQueue.saveQueue(queue);
    },

    // Limpiar cola
    clearQueue() {
        localStorage.removeItem(QUEUE_KEY);
    }
};

export default SyncQueue;
