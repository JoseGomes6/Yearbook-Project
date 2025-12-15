// backend/models/Profile.js

import mongoose from "mongoose";

const profileSchema = new mongoose.Schema(
  {
    // Dados de Autenticação (seriam adicionados aqui se houvesse users/passwords)

    // Dados Pessoais e Acadêmicos (que são mostrados no Yearbook)
    name: {
      type: String,
      required: true,
      trim: true,
    },
    school: {
      type: String,
      required: true,
    },
    academicLevel: {
      type: String,
      required: true,
    },
    photo: {
      type: String,
      default: "https://i.pravatar.cc/150", // URL padrão
    },
    isFriend: {
      type: Boolean,
      default: false,
    },

    // Adicione mais campos conforme o seu perfil (quote, achievements, etc.)
  },
  { timestamps: true }
); // Adiciona campos createdAt e updatedAt automaticamente

const Profile = mongoose.model("Profile", profileSchema);

export default Profile;
