// backend/models/User.js

import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const UserSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true, trim: true },
    password: { type: String, required: true },
    email: { type: String },

    firstName: { type: String, default: "" },
    lastName: { type: String, default: "" },
    phone: { type: String, default: "" },
    dateOfBirth: { type: String, default: "" },
    hometown: { type: String, default: "" },
    city: { type: String, default: "" },
    address: { type: String, default: "" },

    school: { type: String, default: "" },
    year: { type: String, default: "" },
    course: { type: String, default: "" },
    section: { type: String, default: "" },

    achievements: { type: Array, default: [] },
    quote: { type: String, default: "" },

    coverPhoto: { type: String, default: "" },
    profilePhoto: { type: String, default: "" },

    // --- 🚩 NOVOS CAMPOS ADICIONADOS AQUI ---
    // Guarda o ID dos amigos confirmados
    friends: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],

    // Guarda o ID de quem te enviou pedidos (pendentes)
    friendRequests: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    // ----------------------------------------
  },
  { timestamps: true }
);

// ... (Resto do teu código: Middleware pre-save e matchPassword) ...

UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

UserSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model("User", UserSchema);
export default User;
