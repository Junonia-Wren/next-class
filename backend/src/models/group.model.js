import { model, Schema } from "mongoose";

const groupSchema = new Schema(
  {
    name: { type: String, required: true, unique: true }, // e.g., "5A", "6B"

    area: {
      type: String,
      enum: ["DSM", "EVND"],
      required: true,
    },

    level: {
      type: String,
      enum: ["Technical", "Engineering"],
      required: true,
    },
  },
  { timestamps: true }
);

export default model("Group", groupSchema);
