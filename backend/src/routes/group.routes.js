import { Router } from "express";
import groupControllers from "../controllers/group.controllers.js";
import { verifyToken, isAdmin } from "../middlewares/auth.middleware.js";

const router = Router();

// LIBRES
router.get("/getAll", groupControllers.getAll);
router.get("/getOne/:id", groupControllers.getOne);
router.get("/getByName/:name", groupControllers.getByName);

// ADMIN
router.post("/create", verifyToken, isAdmin, groupControllers.create);
router.put("/update/:id", verifyToken, isAdmin, groupControllers.updateOne);
router.delete("/delete/:id", verifyToken, isAdmin, groupControllers.deleteOne);

export default router;
