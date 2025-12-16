import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import Profile from "./models/profile.js";
import User from "./models/User.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5005;
const MONGODB_URI = process.env.MONGODB_URI;

app.use(cors());
app.use(express.json());

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log("✅ Conectado ao MongoDB Atlas com sucesso!");

    app.listen(PORT, () => {
      console.log(`🚀 Servidor Express a correr na porta ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ Erro na conexão com o MongoDB:", err.message);
  });

// ... Rotas de Teste e Perfil (GET/POST) ...
// (Mantenha as rotas que já tinha: "/", "/api/yearbook/profiles", "/api/yearbook/add-profile")

// ==========================================================
// 🔑 ROTAS DE AUTENTICAÇÃO (Registo e Login REAL)
// ==========================================================

// Rota 3. Rota de Registo (Para criar a conta na BD)
app.post("/api/auth/register", async (req, res) => {
  const { username, password } = req.body;

  try {
    const userExists = await User.findOne({ username });

    if (userExists) {
      return res.status(400).json({ message: "Nome de utilizador já existe." });
    }

    // Cria o utilizador (a password é automaticamente hashada no modelo User.js)
    const user = await User.create({ username, password });

    if (user) {
      // Em produção, enviaria um token (JWT) aqui
      res.status(201).json({
        _id: user._id,
        username: user.username,
        message: "Utilizador registado com sucesso.",
      });
    } else {
      res.status(400).json({ message: "Dados inválidos." });
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: "Erro no servidor.", error: error.message });
  }
});

// Rota 4. Rota de Login (Procurar o nome e verificar a password na BD)
app.post("/api/auth/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    // 1. Encontrar o utilizador na BD pelo username
    const user = await User.findOne({ username });

    // 2. Verificar se o utilizador existe E se a password está correta
    // (Usando o método matchPassword do modelo User.js, que usa bcrypt)
    if (user && (await user.matchPassword(password))) {
      // 🛑 Em produção, criaria e enviaria um JWT Token aqui.
      res.json({
        _id: user._id,
        username: user.username,
        message: "Login bem-sucedido.",
      });
    } else {
      // Se o utilizador não existir ou a password estiver errada
      res.status(401).json({ message: "Credenciais inválidas." });
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: "Erro no servidor.", error: error.message });
  }
});

// ==========================================================
// 📝 ROTA DE ATUALIZAÇÃO DO PERFIL (Para o GetStarted.jsx)
// ==========================================================

app.put("/api/profile/:userId", async (req, res) => {
  const { userId } = req.params;
  // req.body contém todos os campos do GetStarted.jsx (firstName, school, quote, achievements, etc.)
  const profileData = req.body;

  try {
    // 1. Encontrar o utilizador pelo ID
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "Utilizador não encontrado." });
    }

    // 2. Anexar e Salvar os Dados do Perfil

    // 🛑 ANEXAR DADOS: Usamos Object.assign para copiar todos os campos de profileData
    // para o documento do utilizador (Mongoose é flexível e adiciona os novos campos).
    Object.assign(user, profileData);

    await user.save(); // Salva o documento atualizado na base de dados

    // 3. Responder com sucesso
    res.status(200).json({
      message: "Perfil atualizado com sucesso!",
      // Devolvemos o objeto atualizado (exclui a password hashada por segurança, a menos que especificado no modelo)
      user: {
        _id: user._id,
        username: user.username,
        // Aqui estariam os novos campos: firstName, school, etc.
        ...profileData,
      },
    });
  } catch (error) {
    console.error("Erro ao atualizar perfil:", error);
    // Devolve um erro 500 se algo correr mal (ex: problema de conexão com a BD)
    res
      .status(500)
      .json({ message: "Erro interno do servidor ao salvar o perfil." });
  }
});
