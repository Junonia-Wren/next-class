import { Router } from "express"; // Importamos solo Router para definir rutas
import adminControllers from "../controllers/admin.controllers.js"; // Controladores de jefes de grupo
import { verifyToken, isAdmin } from "../middlewares/auth.middleware.js"; // Middlewares para proteger rutas

const router = Router(); // Creamos instancia de Router

// Rutas libres (solo lectura, no requieren token)

// Obtener todos los jefes de grupo
// Llama a userDaos.getAllGroupLeaders() → devuelve todos los usuarios con role: "jefe_grupo"
router.get("/getAllLeaders", adminControllers.getAllGroupLeaders);

// Obtener jefe de grupo por grupo
// Llama a userDaos.getGroupLeaderByGrupo(grupo) → busca un jefe por grupo
router.get("/getLeaderByGrupo/:grupo", adminControllers.getGroupLeaderByGrupo);



//Rutas protegidas (solo admin con token)

// Asignar jefe de grupo
// Llama a userDaos.updateRoleByMatricula(matricula, "jefe_grupo")

router.post("/setLeader/:matricula", verifyToken, isAdmin, adminControllers.setLeader);

// Eliminar jefe de grupo (cambiar rol a "alumno")
// Llama a userDaos.updateRoleByMatricula(matricula, "alumno")
router.delete("/deleteJefe/:matricula", verifyToken, isAdmin, adminControllers.deleteJefeGrupo);
// Obtener todos los alumnos (incluye estudiantes y jefe si lo hubiera)
router.get("/getStudentsByGrupo/:grupo", adminControllers.getStudentsByGrupo);

router.get("/teachers", verifyToken, isAdmin, adminControllers.getTeachers);

export default router;