import User from "../models/User.js";

export const sendRequest = async (req, res) => {
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
};

export const pendingRequests = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).populate(
      "friendRequests",
      "firstName lastName profilePhoto school"
    );
    res.json(user.friendRequests || []);
  } catch (error) {
    res.status(500).json({ message: "Erro ao carregar pedidos." });
  }
};

export const acceptRequest = async (req, res) => {
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
};

export const declineRequest = async (req, res) => {
  const { userId, friendId } = req.body;
  try {
    await User.findByIdAndUpdate(userId, {
      $pull: { friendRequests: friendId },
    });
    res.json({ message: "Pedido recusado." });
  } catch (error) {
    res.status(500).json({ message: "Erro ao recusar." });
  }
};

export const removeFriend = async (req, res) => {
  const { userId, friendId } = req.body;
  try {
    // Remove o link de amizade em ambos os documentos
    await User.findByIdAndUpdate(userId, { $pull: { friends: friendId } });
    await User.findByIdAndUpdate(friendId, { $pull: { friends: userId } });
    res.json({ message: "Amigo removido." });
  } catch (error) {
    res.status(500).json({ message: "Erro ao remover." });
  }
};

export const getRequests = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).populate(
      "friendRequests",
      "firstName lastName profilePhoto school"
    );
    res.json(user.friendRequests || []);
  } catch (error) {
    res.status(500).json({ message: "Erro ao carregar pedidos." });
  }
};

export const getFriends = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).populate(
      "friends",
      "firstName lastName profilePhoto school"
    );
    res.json(user.friends || []);
  } catch (error) {
    res.status(500).json({ message: "Erro ao carregar amigos." });
  }
};
