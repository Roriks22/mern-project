const UserModel = require("../models/user");

module.exports.signUp = async (req, res) => {
  console.log("requete recu", req.body);

  const { pseudo, email, password } = req.body;

  try {
    const user = await UserModel.create({ pseudo, email, password });
    res.status(201).json({ user: user._id });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
