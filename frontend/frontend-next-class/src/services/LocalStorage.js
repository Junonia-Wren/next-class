// src/services/LocalStorage.js

const LocalStorage = {

    // Guardar lista completa de una colección
    save(collection, data) {
        localStorage.setItem(collection, JSON.stringify(data));
    },

    // Obtener colección completa
    get(collection) {
        const raw = localStorage.getItem(collection);
        return raw ? JSON.parse(raw) : [];
    },

    // Insertar elemento nuevo
    add(collection, item) {
        const data = LocalStorage.get(collection);
        data.push(item);
        LocalStorage.save(collection, data);
    },

    // Actualizar elemento por ID
    update(collection, idKey, idValue, updatedItem) {
        const data = LocalStorage.get(collection);
        const newData = data.map(item =>
            item[idKey] === idValue ? { ...item, ...updatedItem } : item
        );
        LocalStorage.save(collection, newData);
    },

    // Eliminar elemento por ID
    delete(collection, idKey, idValue) {
        const data = LocalStorage.get(collection);
        const newData = data.filter(item => item[idKey] !== idValue);
        LocalStorage.save(collection, newData);
    }
};

export default LocalStorage;
