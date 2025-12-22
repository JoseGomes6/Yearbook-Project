import User from "../models/User.js";

export const register = async (req, res) => {
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
};

export const login = async (req, res) => {
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
};

export const deleteAccount = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    await Profile.findOneAndDelete({ user: req.params.id });
    res.status(200).send({ message: "Deleted" });
  } catch (error) {
    res.status(500).json({ message: "Erro ao apagar." });
  }
};
