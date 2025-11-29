import { Router } from "express";
import taskControllers from "../controllers/task.controllers.js";
import { verifyToken, isAdmin, isJefeGrupo } from "../middlewares/auth.middleware.js";

const router = Router();

// RUTAS LIBRES (consulta)
router.get('/getAll', taskControllers.getAll);
router.get('/getOne/:task_id', taskControllers.getOne);
router.get('/getByGrupo', taskControllers.getByGrupo);

// RUTA LIBRE (alumno marca tarea como completada)
router.put('/markCompleted/:task_id', verifyToken, taskControllers.markCompleted);

// RUTAS PROTEGIDAS (solo jefe de grupo puede modificar)
router.post('/insertTask', verifyToken, isJefeGrupo, taskControllers.insertOne);
router.put('/updateTask/:task_id', verifyToken, isJefeGrupo, taskControllers.updateOne);
router.delete('/deleteTask/:task_id', verifyToken, isJefeGrupo, taskControllers.deleteOne);

export default router;