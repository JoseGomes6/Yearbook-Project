import User from "../models/User.js";

export const addSignature = async (req, res) => {
  const { targetId } = req.params;
  const { senderId, message } = req.body;
  try {
    const sender = await User.findById(senderId);
    const profile = await Profile.findOne({ user: senderId });
    if (!sender) return res.status(404).json({ message: "User not found" });

    const newSignature = await Signature.create({
      targetId,
      senderId: sender._id,
      senderName: profile?.firstName
        ? `${profile.firstName} ${profile.lastName}`
        : sender.username,
      message,
    });
    res.status(200).json({ message: "Signature added!", newSignature });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getSignatures = async (req, res) => {
  try {
    const signatures = await Signature.find({
      targetId: req.params.userId,
    }).sort({ date: -1 });
    res.json(signatures);
  } catch (error) {
    res.status(500).json({ message: "Erro ao carregar mural." });
  }
};
