const UserModel = require("../models/user");
const ObjectID = require("mongoose").Types.ObjectId;

module.exports.getAllUsers = async (req, res) => {
  const users = await UserModel.find().select("-password");
  res.status(200).json(users);
};

module.exports.userInfo = async (req, res) => {
  if (!ObjectID.isValid(req.params.id))
    return res.status(400).send("Utilisateur non trouvé : " + req.params.id);
  try {
    const user = await UserModel.findById(req.params.id).select("-password");
    if (!user) return res.status(400).send("Utilisateur non trouvé");
    res.send(user);
  } catch (err) {
    console.error("Erreur MongoDB : ", err);
    res.status(500).send("Erreur interne");
  }
};

module.exports.updateUser = async (req, res) => {
  if (!ObjectID.isValid(req.params.id))
    return res.status(400).send("Utilisateur non trouvé : " + req.params.id);
  try {
    const user = await UserModel.findOneAndUpdate(
      { _id: req.params.id },
      //   set = modifie, ajoute
      {
        $set: {
          bio: req.body.bio,
        },
      },
      {
        new: true,
        upsert: true,
        setDefaultsOnInsert: true,
      }
    );
    if (!user) return res.status(404).send("Aucun utilisateur mis à jour");
    res.status(200).send(user);
  } catch (err) {
    console.error("Erreur update :", err);
    return res.status(500).json({ message: err.message });
  }
};

module.exports.deleteUser = async (req, res) => {
  if (!ObjectID.isValid(req.params.id))
    return res.status(400).send("Utilisateur non trouvé : " + req.params.id);

  try {
    const result = await UserModel.deleteOne({
      _id: req.params.id,
    });
    if (result.deletedCount === 0) {
      return res.status(404).send("Aucun utilisateur trouvé à supprimer.");
    }
    res.status(200).json({ message: "Utilisateur supprimé !" });
  } catch (err) {
    console.error("Erreur suppression :", err);
    return res.status(500).json({ message: err.message });
  }
};

module.exports.follow = async (req, res) => {
  const userId = req.params.id;
  const idToFollow = req.body.idToFollow;
  if (!ObjectID.isValid(userId))
    return res.status(400).send("ID utilisateur invalide : " + userId);
  if (!ObjectID.isValid(idToFollow))
    return res.status(400).send("ID à suivre invalide : " + idToFollow);
  try {
    // Ajout dans "following" de l'utilisateur qui suit
    const userFollowing = await UserModel.findByIdAndUpdate(
      userId,
      {
        // addToSet = rajoute à ce que l'on a déjà mis
        $addToSet: { following: idToFollow },
      },
      {
        new: true,
      }
    );
    if (!userFollowing)
      return res.status(404).send("Utilisateur suiveur introuvable");
    // Ajout dans "followers" de l'utilisateur suivi
    const userFollowed = await UserModel.findByIdAndUpdate(
      idToFollow,
      {
        $addToSet: { followers: userId },
      },
      { new: true }
    );
    if (!userFollowed) {
      return res.status(404).send("Utilisateur suivi introuvable");
    }
    // Réponse finale
    res.status(200).json({
      message: "Suivi effectué avec succès",
      follower: userFollowing._id,
      followed: userFollowed._id,
    });
  } catch (err) {
    console.error("Erreur dans follow :", err);
    return res.status(500).json({ message: err.message });
  }
};

module.exports.unfollow = async (req, res) => {
  const userId = req.params.id;
  const idToUnfollow = req.body.idToUnfollow;
  if (!ObjectID.isValid(userId))
    return res.status(400).send("ID utilisateur invalide : " + userId);
  if (!ObjectID.isValid(idToUnfollow))
    return res.status(400).send("ID à suivre invalide : " + idToUnfollow);
  try {
    // Ajout dans "following" de l'utilisateur qui suit
    const userFollowing = await UserModel.findByIdAndUpdate(
      userId,
      {
        // addToSet = rajoute à ce que l'on a déjà mis
        $pull: { following: idToUnfollow },
      },
      {
        new: true,
      }
    );
    if (!userFollowing)
      return res.status(404).send("Utilisateur suiveur introuvable");
    // Ajout dans "followers" de l'utilisateur suivi
    const userFollowed = await UserModel.findByIdAndUpdate(
      idToUnfollow,
      {
        $pull: { followers: userId },
      },
      { new: true }
    );
    if (!userFollowed) {
      return res.status(404).send("Utilisateur suivi introuvable");
    }
    // Réponse finale
    res.status(200).json({
      message: "Utilisateur désabonner avec succès",
      follower: userFollowing._id,
      followed: userFollowed._id,
    });
  } catch (err) {
    console.error("Erreur dans follow :", err);
    return res.status(500).json({ message: err.message });
  }
};
