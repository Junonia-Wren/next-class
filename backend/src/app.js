import express from "express";
import morgan from "morgan";
import cors from "cors"; 
import "./database.js";

import scheduleRoutes from "./routes/schedule.routes.js";
import authRoutes from "./routes/auth.routes.js";
import adminRoutes from "./routes/admin.routes.js";

const app = express();

app.set("port", process.env.PORT || 3000);


app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({extended:false}));
app.use(cors()); 

app.use("/api/schedules", scheduleRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);


export default app; 