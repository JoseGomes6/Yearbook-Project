// backend/models/User.js

import mongoose from "mongoose";
import bcrypt from "bcryptjs"; // Importa o bcrypt

const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true, // Garante que não há nomes de utilizador duplicados
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    // Opcional: Liga o perfil ao utilizador (para mais tarde)
    profileId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Profile", // Referencia o modelo Profile que já tem
      required: false,
    },
  },
  { timestamps: true }
);

// Middleware para encriptar a password antes de guardar
UserSchema.pre("save", async function (next) {
  // Se a password não foi modificada, avança
  if (!this.isModified("password")) {
    return next();
  }
  // Cria o hash da password com um salt de 10
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Método para comparar a password no login
UserSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model("User", UserSchema);
export default User;
