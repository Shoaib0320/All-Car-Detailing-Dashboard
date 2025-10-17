import mongoose from "mongoose";

export const UserRole = {
  ADMIN: "Admin",
  SUPERADMIN: "SuperAdmin",
  USER: "User",
  AGENT: "Agent",
};

export const UserStatus = {
  ACTIVE: "Active",
  PENDING: "Pending",
  INACTIVE: "Inactive",
};

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, trim: true },
    phone: { type: String, trim: true },
    address: { type: String, trim: true },
    role: {
      type: String,
      enum: Object.values(UserRole),
      required: true,
    },
    status: {
      type: String,
      enum: Object.values(UserStatus),
      default: UserStatus.PENDING,
    },
  },
  {
    timestamps: true,
  }
);

// Reuse model if it already exists (important for Next.js hot reload)
const User = mongoose.models.User || mongoose.model("User", UserSchema);

export default User;
