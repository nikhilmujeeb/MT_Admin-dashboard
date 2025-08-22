import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const assignedItemSchema = new mongoose.Schema(
  {
    firstname: { type: String, trim: true },
    phone: { type: String, trim: true },
    notes: { type: String, trim: true },
  },
  { _id: false }
);

const agentSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    mobile: {
      type: String,
      required: true,
      trim: true,
      match: [/^\+\d{1,3}\d{7,14}$/, "Mobile must include country code, e.g. +91XXXXXXXXXX"],
    },
    password: { type: String, required: true, minlength: 6 },
    assignedList: [assignedItemSchema],
  },
  { timestamps: true }
);

agentSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

agentSchema.methods.matchPassword = async function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};

const Agent = mongoose.model("Agent", agentSchema);
export default Agent;
