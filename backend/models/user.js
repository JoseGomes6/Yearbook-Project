// backend/models/User.js

import mongoose from "mongoose";
import bcrypt from "bcryptjs"; // Importa o bcrypt

const UserSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true, trim: true },
    password: { type: String, required: true },
    email: { type: String }, // Adiciona o email aqui para o registo funcionar

    // --- CAMPOS DO PERFIL (Adicionados para o GetStarted) ---
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

    achievements: { type: Array, default: [] }, // Array de objetos {title, description, image}
    quote: { type: String, default: "" },

    coverPhoto: { type: String, default: "" }, // URL ou Path da imagem
    profilePhoto: { type: String, default: "" }, // URL ou Path da imagem
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
