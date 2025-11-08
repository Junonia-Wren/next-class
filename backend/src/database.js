import mongoose from "mongoose";

mongoose.connect("mongodb://localhost:27017/nextclass_db")

.then (()=> console.log("DB Connected"))
.catch((err)=>console.error(err));

export default mongoose;