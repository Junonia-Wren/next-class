import { model, Schema } from "mongoose";

const subjectSchema = new Schema({
    name: { type: String, required: true },

    groups: {
        type: [{ type: Schema.Types.ObjectId, ref: "Group" }],
        required: true,
        validate: v => Array.isArray(v) && v.length > 0
    },

    teacher: {
        type: Schema.Types.ObjectId,
        ref: "User",
        default: null
    }
}, { timestamps: true });

export default model("Subject", subjectSchema);
