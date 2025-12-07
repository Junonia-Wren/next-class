import { model, Schema } from "mongoose";

const subjectSchema = new Schema(
  {
    name: { type: String, required: true },

    groups: {
      type: [{ type: Schema.Types.ObjectId, ref: "Group" }],
      required: true,
      validate: {
        validator: v => Array.isArray(v) && v.length > 0,
        message: "Subject must have at least one group assigned.",
      },
    },
  },
  { timestamps: true }
);

export default model("Subject", subjectSchema);
