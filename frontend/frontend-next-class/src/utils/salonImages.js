// Importa aquí tus imágenes reales cuando las tengas
// import labIdiomas from '../assets/salones/lab_idiomas.png';
import defaultHallway from '../assets/hallway.png';
import S121 from '../assets/Aula121.png'
import S122 from '../assets/Aula122.png'
import S123 from '../assets/Aula123.png'
import S124 from '../assets/Aula124.png'
import L1 from '../assets/Laboratorio1.png'
import L2 from '../assets/Laboratorio2.png'
import L3 from '../assets/Laboratorio3.png'
import LI from '../assets/LaboratorioIdiomas.png'

export const getSalonImage = (salonName) => {
    if (!salonName) return defaultHallway;

    // Normalizamos el nombre para evitar errores por mayúsculas/tildes
    const name = salonName.toLowerCase().trim();

    // Mapeo de nombres a imágenes
    const salonMap = {
        "121": S121, // Cambiar por variable importada
        "122": S122,
        "123": S123,
        "124": S124,
        "Laboratorio 1": L1,
        "Laboratorio 2": L2,
        "Laboratorio 3": L3,
        "Laboratorio 1 de Idiomas": LI,
        // Agrega aquí todos tus salones...
    };

    return salonMap[name] || defaultHallway;
};