import { model, Schema } from "mongoose";

const scheduleSchema = new Schema(
  {
    group: {
      type: Schema.Types.ObjectId,
      ref: "Group",
      required: true,
    },

    subject: {
      type: Schema.Types.ObjectId,
      ref: "Subject",
      required: true,
    },

    teacher: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    day: {
      type: String,
      enum: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      required: true,
    },

    classroom: { type: String },

    startTime: { type: String }, // e.g. "08:00"
    endTime: { type: String },   // e.g. "09:00"

    roomImage: { type: String },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

export default model("Schedule", scheduleSchema);
