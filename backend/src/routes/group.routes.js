import { Router } from "express";
import groupControllers from "../controllers/group.controllers.js";
import { verifyToken, isAdmin } from "../middlewares/auth.middleware.js";

const router = Router();

router.get("/areas", groupControllers.getUniqueAreas);
// === LECTURA ===
router.get("/getAll", verifyToken, isAdmin, groupControllers.getAll);

// OJO AQUÍ: Cambiamos 'getOne' por 'getOneWithStudents' para que traiga la lista de alumnos
router.get("/getOne/:id", verifyToken, isAdmin, groupControllers.getOneWithStudents);

router.get("/getByName/:name", groupControllers.getByName);

// === ACCIONES DE GRUPO (ADMIN) ===
router.post("/create", verifyToken, isAdmin, groupControllers.create);
router.put("/update/:id", verifyToken, isAdmin, groupControllers.updateOne);
router.delete("/delete/:id", verifyToken, isAdmin, groupControllers.deleteOne);

// === ACCIONES DE ALUMNOS DENTRO DEL GRUPO (NUEVAS) ===
router.post("/toggleRole", verifyToken, isAdmin, groupControllers.toggleStudentRole);   // Asignar Jefe
router.post("/removeStudent", verifyToken, isAdmin, groupControllers.removeStudent); // Sacar alumno

export default router;