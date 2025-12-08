// Importa aquí tus imágenes reales cuando las tengas
// import labIdiomas from '../assets/salones/lab_idiomas.png';
import defaultHallway from '../assets/hallway.png';

export const getSalonImage = (salonName) => {
    if (!salonName) return defaultHallway;

    // Normalizamos el nombre para evitar errores por mayúsculas/tildes
    const name = salonName.toLowerCase().trim();

    // Mapeo de nombres a imágenes
    const salonMap = {
        "121": defaultHallway, // Cambiar por variable importada
        "122": defaultHallway,
        "123": defaultHallway,
        "124": defaultHallway,
        "Laboratorio 1": defaultHallway,
        "Laboratorio 2": defaultHallway,
        "Laboratorio 3": defaultHallway,
        "Laboratorio 1 de Idiomas": defaultHallway,
        // Agrega aquí todos tus salones...
    };

    return salonMap[name] || defaultHallway;
};