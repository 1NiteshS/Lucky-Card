// models/SuperAdmin.js
import mongoose from 'mongoose';

const SuperAdminSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.model("SuperAdmin", SuperAdminSchema);
