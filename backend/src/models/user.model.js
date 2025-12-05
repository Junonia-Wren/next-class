import { model, Schema } from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new Schema(
  {
    matricula: { type: String, required: true, unique: true },

    name: { type: String, required: true },

    password: { type: String, required: true },

    role: {
      type: String,
      enum: ["admin", "group_leader", "student", "teacher"],
      default: "student",
    },

    group: {
      type: Schema.Types.ObjectId,
      ref: "Group",
      default: null,
    },
  },
  { timestamps: true }
);

// Encrypt password
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);

  next();
});

// Compare password
userSchema.methods.comparePassword = function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

export default model("User", userSchema);
