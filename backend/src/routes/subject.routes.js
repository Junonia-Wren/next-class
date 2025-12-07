import { Router } from "express";
import subjectControllers from "../controllers/subject.controllers.js";
import { verifyToken, isAdmin } from "../middlewares/auth.middleware.js";

const router = Router();

// LIBRES
router.get("/getAll", subjectControllers.getAll);
router.get("/getOne/:id", subjectControllers.getOne);
router.get("/byGroupName/:groupName", subjectControllers.getByGroupName);

// ADMIN
router.post("/create", verifyToken, isAdmin, subjectControllers.create);
router.put("/update/:id", verifyToken, isAdmin, subjectControllers.updateOne);
router.delete("/delete/:id", verifyToken, isAdmin, subjectControllers.deleteOne);

export default router;
