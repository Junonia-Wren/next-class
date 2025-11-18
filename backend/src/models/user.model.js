import { model, Schema } from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new Schema({

    matricula: { type: String, required: true, unique: true },
    name: { type: String },
    password: { type: String, required: true },
    role: {
        type: String,
        enum: ["admin", "jefe_grupo", "alumno"],
        default: "alumno"
    },
    area: {
        type: String,
        enum: ["DSM", "EVND"],
        required: true
    },
    nivel: {
        type: String,
        enum: ["Técnico", "Ingeniería"],
        required: true
    },
    grupo: {
        type: String,
        enum: ["1A", "1B", "2A","2B", "3A","3B", "4A", "4B","5A","5B", "6A","6B","8A","8B", "9A","9B","10A","10B" ],
        required: true
    }

});

//Encriptar contraseña
userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});
// Comparar contraseñas:
userSchema.methods.comparePassword = function (candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
};

export default model("User", userSchema);