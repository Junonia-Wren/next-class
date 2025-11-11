import { Router } from "express";
import scheduleControllers from "../controllers/schedule.controllers.js";
import { verifyToken, isAdmin } from "../middlewares/auth.middleware.js";

const router = Router();

//  RUTAS LIBRES (consulta)
router.get('/getAll', scheduleControllers.getAll);
router.get('/getOne/:schedule_id', scheduleControllers.getOne);
router.get('/getByGrupo', scheduleControllers.getByGrupo); // ← NUEVA RUTA
router.get('/getHorarioAlumno/:matricula', scheduleControllers.getHorarioAlumno);

// RUTAS PROTEGIDAS (solo admin puede modificar)
router.post('/insertSchedule', verifyToken, isAdmin, scheduleControllers.insertOne);
router.put('/updateSchedule/:schedule_id', verifyToken, isAdmin, scheduleControllers.updateOne);
router.delete('/deleteSchedule/:schedule_id', verifyToken, isAdmin, scheduleControllers.deleteOne);

export default router;