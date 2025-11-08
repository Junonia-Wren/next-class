import { Router } from "express";
import scheduleControllers from "../controllers/schedule.controllers.js";

const router = Router();

router.get('/getAll', scheduleControllers.getAll);
router.get('/getOne/:schedule_id', scheduleControllers.getOne);
router.post('/insertOne', scheduleControllers.insertOne);
router.put('/updateOne/:schedule_id', scheduleControllers.updateOne);
router.delete('/deleteOne/:schedule_id', scheduleControllers.deleteOne);

export default router;