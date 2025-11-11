import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("DB Connected"))
    .catch((err) => console.error("Error de conexión:", err));

export default mongoose;