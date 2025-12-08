import { model, Schema } from "mongoose";

const subjectSchema = new Schema(
  {
    name: { type: String, required: true },

    porcentajes: {
      ser: {
        valor: { type: Number, default: 0 },
        descripcion: { type: String, default: "" }
      },
      saber: {
        valor: { type: Number, default: 0 },
        descripcion: { type: String, default: "" }
      },
      saberHacer: {
        valor: { type: Number, default: 0 },
        descripcion: { type: String, default: "" }
      }
    },

    unidades: [
      {
        porcentaje: { type: Number, default: 0 },
        fechas: { type: String, default: "" }
      }
    ],

    notas: { type: String, default: "" },

    // === TUS CAMPOS ORIGINALES (SIN CAMBIOS) ===
    groups: {
      type: [{ type: Schema.Types.ObjectId, ref: "Group" }],
      required: true,
      validate: {
        validator: (v) => Array.isArray(v) && v.length > 0,
        message: "Subject must have at least one group assigned.",
      },
    },
  },
  { timestamps: true }
);

export default model("Subject", subjectSchema);
