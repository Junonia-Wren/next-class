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
// Verifica antes si ya hay jefe en ese grupo
router.post("/asignarJefe", verifyToken, isAdmin, adminControllers.asignarJefeGrupo);

// Actualizar datos del jefe de grupo
// Llama a userDaos.updateOne(matricula, data)
router.put("/updateJefe/:matricula", verifyToken, isAdmin, adminControllers.updateJefeGrupo);

// Eliminar jefe de grupo (cambiar rol a "alumno")
// Llama a userDaos.updateRoleByMatricula(matricula, "alumno")
router.delete("/deleteJefe/:matricula", verifyToken, isAdmin, adminControllers.deleteJefeGrupo);

router.get("/dashboard-stats", verifyToken, isAdmin, adminControllers.getDashboardData);

export default router;