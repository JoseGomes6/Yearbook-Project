import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import User from "./models/User.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5005;
const MONGODB_URI = process.env.MONGODB_URI;

// Configuração de CORS e Limite de JSON
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

app.post("/api/auth/register", async (req, res) => {
  const { username, password, email } = req.body;
  try {
    const userExists = await User.findOne({ username });
    if (userExists)
      return res.status(400).json({ message: "Nome de utilizador já existe." });

    const user = await User.create({ username, password, email });
    res
      .status(201)
      .json({ _id: user._id, username: user.username, message: "Sucesso." });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Erro no servidor.", error: error.message });
  }
});

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
    res.status(500).json({ message: "Erro no servidor." });
  }
});

// ==========================================================
// 📝 ROTAS DE PERFIL
// ==========================================================

app.put("/api/profile/:userId", async (req, res) => {
  const { userId } = req.params;
  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "Não encontrado." });
    Object.assign(user, req.body);
    await user.save();
    res.status(200).json({ message: "Perfil atualizado!", user });
  } catch (error) {
    res.status(500).json({ message: "Erro ao salvar." });
  }
});

app.get("/api/profile/:userId", async (req, res) => {
  try {
    const user = await User.findById(req.params.userId)
      .select("-password")
      .populate("friends", "firstName lastName profilePhoto");
    if (!user) return res.status(404).json({ message: "Não encontrado." });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Erro ao carregar." });
  }
});

app.get("/api/yearbook/profiles", async (req, res) => {
  try {
    // Adicionamos 'friends' e 'friendRequests' ao select
    const users = await User.find({ firstName: { $exists: true } }).select(
      "username firstName lastName profilePhoto school course friends friendRequests"
    );
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Erro ao listar perfis." });
  }
});

// ==========================================================
// 👥 ROTAS DE AMIGOS (Friend System)
// ==========================================================

// 1. Enviar Pedido
app.post("/api/friends/request/:targetId", async (req, res) => {
  const { senderId } = req.body;
  const { targetId } = req.params;
  try {
    const target = await User.findById(targetId);
    if (
      target.friends.includes(senderId) ||
      target.friendRequests.includes(senderId)
    ) {
      return res
        .status(400)
        .json({ message: "Ação inválida ou pedido já pendente." });
    }
    await User.findByIdAndUpdate(targetId, {
      $addToSet: { friendRequests: senderId },
    });
    res.json({ message: "Pedido enviado!" });
  } catch (error) {
    res.status(500).json({ message: "Erro no pedido." });
  }
});

// 2. Obter Pedidos Pendentes
app.get("/api/friends/requests/:userId", async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).populate(
      "friendRequests",
      "firstName lastName profilePhoto school"
    );
    res.json(user.friendRequests || []);
  } catch (error) {
    res.status(500).json({ message: "Erro ao carregar pedidos." });
  }
});

// 3. Obter Lista de Amigos Confirmados
app.get("/api/friends/list/:userId", async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).populate(
      "friends",
      "firstName lastName profilePhoto school"
    );
    res.json(user.friends || []);
  } catch (error) {
    res.status(500).json({ message: "Erro ao carregar amigos." });
  }
});

// 4. Aceitar Pedido
app.post("/api/friends/accept", async (req, res) => {
  const { userId, friendId } = req.body;
  try {
    const user = await User.findById(userId);
    const friend = await User.findById(friendId);

    // Adiciona à lista de ambos
    user.friends.push(friendId);
    friend.friends.push(userId);

    // Remove dos pedidos pendentes
    user.friendRequests = user.friendRequests.filter(
      (id) => id.toString() !== friendId
    );

    await user.save();
    await friend.save();
    res.json({ message: "Agora são amigos!" });
  } catch (error) {
    res.status(500).json({ message: "Erro ao aceitar." });
  }
});

// 5. Remover Amigo
app.post("/api/friends/remove", async (req, res) => {
  const { userId, friendId } = req.body;
  try {
    // Remove o link de amizade em ambos os documentos
    await User.findByIdAndUpdate(userId, { $pull: { friends: friendId } });
    await User.findByIdAndUpdate(friendId, { $pull: { friends: userId } });
    res.json({ message: "Amigo removido." });
  } catch (error) {
    res.status(500).json({ message: "Erro ao remover." });
  }
});

// 6. Recusar Pedido (Decline)
app.post("/api/friends/decline", async (req, res) => {
  const { userId, friendId } = req.body;
  try {
    await User.findByIdAndUpdate(userId, {
      $pull: { friendRequests: friendId },
    });
    res.json({ message: "Pedido recusado." });
  } catch (error) {
    res.status(500).json({ message: "Erro ao recusar." });
  }
});
