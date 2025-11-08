import express from "express";
import morgan from "morgan";
import "./database.js";

import scheduleRoutes from "./routes/schedule.routes.js";

const app = express();

app.set("port", process.env.PORT || 3000);


app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({extended:false}));

app.use("/api/schedules", scheduleRoutes);



export default app; 