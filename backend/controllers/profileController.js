import User from "../models/User.js";

export const updateProfile = async (req, res) => {
  try {
    const profile = await Profile.findOneAndUpdate(
      { user: req.params.userId },
      req.body,
      { new: true, upsert: true }
    );
    res.status(200).json({ message: "Perfil atualizado!", profile });
  } catch (error) {
    res.status(500).json({ message: "Erro ao salvar." });
  }
};

export const getProfile = async (req, res) => {
  try {
    const { userId } = req.params;

    // 1. Procurar o USER primeiro para garantir que temos o array de amigos atualizado
    const userDoc = await User.findById(userId);
    if (!userDoc) {
      return res.status(404).json({ message: "Utilizador não encontrado." });
    }

    const profileDoc = await Profile.findOne({ user: userId });

    const friendsProfiles = await Profile.find({
      user: { $in: userDoc.friends },
    }).select("firstName lastName profilePhoto user");

    const finalData = {
      ...userDoc.toObject(),
      ...profileDoc?.toObject(),
      friends: friendsProfiles,
    };

    res.json(finalData);
  } catch (error) {
    console.error("Erro ao agregar perfil:", error);
    res.status(500).json({ message: "Erro ao carregar dados." });
  }
};

export const getYearbook = async (req, res) => {
  try {
    const profiles = await Profile.find({
      firstName: { $exists: true },
    }).select(
      "username firstName lastName profilePhoto school course friends friendRequests"
    );
    res.json(profiles);
  } catch (error) {
    res.status(500).json({ message: "Erro ao listar." });
  }
};
