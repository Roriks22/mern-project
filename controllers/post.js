const PostModel = require("../models/post");
const UserModel = require("../models/user");
const ObjectID = require("mongoose").Types.ObjectId;

module.exports.readPost = async (req, res) => {
  try {
    const posts = await PostModel.find();
    res.status(200).json(posts);
  } catch (err) {
    console.error("Erreur lors de la récupération des données :", err);
    res.status(500).json({ message: "Erreur serveur", error: err.message });
  }
};
module.exports.createPost = async (req, res) => {
  const newPost = new PostModel({
    posterId: req.body.posterId,
    message: req.body.message,
    video: req.body.video,
    likers: [],
    comments: [],
  });
  try {
    const post = await newPost.save();
    return res.status(201).json(post);
  } catch (err) {
    return res.status(400).send(err);
  }
};
module.exports.updatePost = async (req, res) => {
  if (!ObjectID.isValid(req.params.id))
    return res.status(400).send("Utilisateur non trouvé : " + req.params.id);

  try {
    const updatedRecord = {
      message: req.body.message,
    };
    const modifiedPost = await PostModel.findByIdAndUpdate(
      req.params.id,
      {
        $set: updatedRecord,
      },
      { new: true }
    );
    res.status(200).json(modifiedPost);
  } catch (err) {
    console.error("Erreur lors de la modification des données :", err);
    res.status(500).json({ message: "Erreur serveur", error: err.message });
  }
};
module.exports.deletePost = async (req, res) => {
  if (!ObjectID.isValid(req.params.id))
    return res.status(400).send("Utilisateur non trouvé : " + req.params.id);

  try {
    const delPost = await PostModel.findOneAndDelete(req.params.id);
    res.status(200).json(delPost);
  } catch (err) {
    console.error("Erreur lors de la suppression des données :", err);
    res.status(500).json({ message: "Erreur serveur", error: err.message });
  }
};
module.exports.likePost = async (req, res) => {
  if (!ObjectID.isValid(req.params.id))
    return res.status(400).send("Utilisateur non trouvé : " + req.params.id);
  try {
    const lovePost = await PostModel.findByIdAndUpdate(
      req.params.id,
      {
        $addToSet: { likers: req.body.id },
      },
      { new: true }
    );
    res.status(200).json(lovePost);
  } catch (err) {
    console.error("Erreur lors du like :", err);
    res.status(500).json({ message: "Erreur serveur", error: err.message });
  }
  try {
    const loveUser = await UserModel.findByIdAndUpdate(
      req.body.id,
      {
        $addToSet: { likes: req.params.id },
      },
      { new: true }
    );
    res.status(200).json(loveUser);
  } catch (err) {
    console.error("Erreur lors du like :", err);
    res.status(500).json({ message: "Erreur serveur", error: err.message });
  }
};
module.exports.unlikePost = async (req, res) => {
  if (!ObjectID.isValid(req.params.id))
    return res.status(400).send("Utilisateur non trouvé : " + req.params.id);
  try {
    const unlovePost = await PostModel.findByIdAndUpdate(
      req.params.id,
      {
        $pull: { likers: req.body.id },
      },
      { new: true }
    );
    res.status(200).json(unlovePost);
  } catch (err) {
    console.error("Erreur lors du unlike :", err);
    res.status(500).json({ message: "Erreur serveur", error: err.message });
  }
  try {
    const unloveUser = await UserModel.findByIdAndUpdate(
      req.body.id,
      {
        $pull: { likes: req.params.id },
      },
      { new: true }
    );
    res.status(200).json(unloveUser);
  } catch (err) {
    console.error("Erreur lors du unlike :", err);
    res.status(500).json({ message: "Erreur serveur", error: err.message });
  }
};
