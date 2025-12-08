import { Router } from "express";
import taskControllers from "../controllers/task.controllers.js";
import { verifyToken, isJefeGrupo } from "../middlewares/auth.middleware.js";

const router = Router();

// CONSULTAS (Protegidas con verifyToken para saber quién pregunta)
router.get('/getAll', verifyToken, taskControllers.getAll);
router.get('/getOne/:task_id', verifyToken, taskControllers.getOne);
router.get('/getByGrupo', verifyToken, taskControllers.getByGrupo);

// ALUMNO (Marcar como completada)
router.put('/markCompleted/:task_id', verifyToken, taskControllers.markCompleted);

// JEFE DE GRUPO (Crear, Editar, Borrar)
// Nota: isJefeGrupo debe verificar si es 'chief' o 'admin'
router.post('/insertTask', verifyToken, isJefeGrupo, taskControllers.insertOne);
router.put('/updateTask/:task_id', verifyToken, isJefeGrupo, taskControllers.updateOne);
router.delete('/deleteTask/:task_id', verifyToken, isJefeGrupo, taskControllers.deleteOne);

export default router;