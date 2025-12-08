import { model, Schema } from "mongoose";

const taskSchema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    dueDate: { type: Date, required: true },
    
    // Relaciones
    subject: {
      type: Schema.Types.ObjectId,
      ref: "Subject",
      required: true,
    },
    group: {
      type: Schema.Types.ObjectId,
      ref: "Group",
      required: true,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    completed: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default model("Task", taskSchema);