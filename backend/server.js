import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import User from "./models/User.js"; // Garante que o caminho está correto

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5005;
const MONGODB_URI = process.env.MONGODB_URI;

// Configuração de CORS e Limite de JSON (Aumentado para suportar fotos em Base64)
app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

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

// ==========================================================
// 🔑 ROTAS DE AUTENTICAÇÃO
// ==========================================================

// 1. Registo
app.post("/api/auth/register", async (req, res) => {
  const { username, password, email } = req.body;
  try {
    const userExists = await User.findOne({ username });
    if (userExists) {
      return res.status(400).json({ message: "Nome de utilizador já existe." });
    }

    const user = await User.create({ username, password, email });

    if (user) {
      res.status(201).json({
        _id: user._id,
        username: user.username,
        email: user.email,
        message: "Utilizador registado com sucesso.",
      });
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: "Erro no servidor.", error: error.message });
  }
});

// 2. Login
app.post("/api/auth/login", async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });
    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id,
        username: user.username,
        message: "Login bem-sucedido.",
      });
    } else {
      res.status(401).json({ message: "Credenciais inválidas." });
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: "Erro no servidor.", error: error.message });
  }
});

// ==========================================================
// 📝 ROTAS DE PERFIL (GetStarted & Profile Display)
// ==========================================================

// 3. ATUALIZAR Perfil (PUT) - Usado pelo GetStarted.jsx
app.put("/api/profile/:userId", async (req, res) => {
  const { userId } = req.params;
  const profileData = req.body;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "Utilizador não encontrado." });
    }

    // Mescla os dados recebidos no documento do utilizador
    Object.assign(user, profileData);
    await user.save();

    res.status(200).json({ message: "Perfil atualizado com sucesso!", user });
  } catch (error) {
    console.error("Erro ao atualizar perfil:", error);
    res.status(500).json({ message: "Erro ao salvar o perfil." });
  }
});

// 4. OBTER Perfil (GET) - Agora com Populate para mostrar amigos reais
app.get("/api/profile/:userId", async (req, res) => {
  try {
    const user = await User.findById(req.params.userId)
      .select("-password") // Segurança: não envia a password
      .populate("friends", "firstName lastName profilePhoto"); // 🔥 TROCA IDs POR DADOS REAIS

    if (!user) {
      return res.status(404).json({ message: "Perfil não encontrado." });
    }
    res.json(user);
  } catch (error) {
    console.error("Erro ao carregar perfil:", error);
    res.status(500).json({ message: "Erro ao carregar perfil." });
  }
});

// 5. LISTAR TODOS OS PERFIS (Opcional - Para a página geral do Yearbook)
app.get("/api/yearbook/profiles", async (req, res) => {
  try {
    const users = await User.find({ firstName: { $exists: true } }).select(
      "username firstName lastName profilePhoto school course"
    );
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Erro ao listar perfis." });
  }
});

// 1. Enviar Pedido (COM VALIDAÇÃO)
app.post("/api/friends/request/:targetId", async (req, res) => {
  const { senderId } = req.body;
  const { targetId } = req.params;

  try {
    const target = await User.findById(targetId);
    const sender = await User.findById(senderId);

    // Validação A: Já são amigos?
    if (target.friends.includes(senderId)) {
      return res.status(400).json({ message: "Vocês já são amigos!" });
    }

    // Validação B: Já existe um pedido pendente?
    if (target.friendRequests.includes(senderId)) {
      return res.status(400).json({ message: "Pedido já enviado e pendente." });
    }

    // Usa $addToSet para segurança extra contra duplicados
    await User.findByIdAndUpdate(targetId, {
      $addToSet: { friendRequests: senderId },
    });

    res.json({ message: "Pedido enviado!" });
  } catch (error) {
    res.status(500).json({ message: "Erro ao processar pedido." });
  }
});

// 2. Aceitar Pedido
app.post("/api/friends/accept", async (req, res) => {
  const { userId, friendId } = req.body;
  const user = await User.findById(userId);
  const friend = await User.findById(friendId);

  // Adicionar aos amigos de ambos
  user.friends.push(friendId);
  friend.friends.push(userId);

  // Remover dos pedidos pendentes
  user.friendRequests = user.friendRequests.filter(
    (id) => id.toString() !== friendId
  );

  await user.save();
  await friend.save();
  res.json({ message: "Agora são amigos!" });
});

app.get("/api/friends/requests/:userId", async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).populate(
      "friendRequests",
      "firstName lastName profilePhoto school"
    );

    res.json(user.friendRequests);
  } catch (error) {
    res.status(500).json({ message: "Erro ao carregar pedidos." });
  }
});
