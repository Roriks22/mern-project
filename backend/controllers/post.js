const PostModel = require("../models/post");
const UserModel = require("../models/user");
const fs = require("fs");
const { uploadErrors } = require("../utils/errors");
const ObjectID = require("mongoose").Types.ObjectId;

module.exports.readPost = async (req, res) => {
  try {
    const posts = await PostModel.find().sort({ createdAt: -1 });
    res.status(200).json(posts);
  } catch (err) {
    console.error("Erreur lors de la récupération des données :", err);
    res.status(500).json({ message: "Erreur serveur", error: err.message });
  }
};
module.exports.createPost = async (req, res) => {
  let fileName;

  if (req.file) {
    try {
      if (
        req.file.mimetype !== "image/jpg" &&
        req.file.mimetype !== "image/png" &&
        req.file.mimetype !== "image/jpeg"
      ) {
        throw Error("invalid file");
      }

      if (req.file.size > 600000) throw Error("max size");
    } catch (err) {
      const errors = uploadErrors(err);
      return res.status(400).json({ errors });
    }
    fileName = req.body.posterId + Date.now() + ".jpg";

    try {
      const uploadPath = `${__dirname}/../uploads/posts/`;
      if (!fs.existsSync(uploadPath)) {
        fs.mkdirSync(uploadPath, { recursive: true });
      }
      await fs.promises.writeFile(uploadPath + fileName, req.file.buffer);
    } catch (err) {
      return res
        .status(500)
        .json({ message: "Erreur lors du traitement du fichier." });
    }
  }

  const newPost = new PostModel({
    posterId: req.body.posterId,
    message: req.body.message,
    picture: fileName ? `uploads/posts/${fileName}` : "",
    video: req.body.video || "",
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
    const delPost = await PostModel.findByIdAndDelete(req.params.id);
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

module.exports.commentPost = async (req, res) => {
  if (!ObjectID.isValid(req.params.id))
    return res.status(400).send("Utilisateur non trouvé : " + req.params.id);
  try {
    const postComment = await PostModel.findByIdAndUpdate(
      req.params.id,
      {
        $push: {
          comments: {
            commenterId: req.body.commenterId,
            commenterPseudo: req.body.commenterPseudo,
            text: req.body.text,
            timestamp: new Date().getTime(),
          },
        },
      },
      {
        new: true,
      }
    );
    res.status(200).json(postComment);
  } catch (err) {
    console.error("Erreur lors du commentaire :", err);
    res.status(500).json({ message: "Erreur serveur", error: err.message });
  }
};
module.exports.editCommentPost = async (req, res) => {
  if (!ObjectID.isValid(req.params.id))
    return res.status(400).send("Utilisateur non trouvé : " + req.params.id);
  try {
    const commentEdit = await PostModel.findById(req.params.id);
    if (!commentEdit) return res.status(404).send("Commentaire non trouvé.");
    const theComment = commentEdit.comments.find((comment) =>
      comment._id.equals(req.body.commentId)
    );

    if (!theComment) return res.status(404).send("Commentaire non trouvé.");
    theComment.text = req.body.text;

    const updatePost = await commentEdit.save();
    return res.status(200).send(updatePost);
  } catch (err) {
    console.error("Erreur lors de la modification");
    return res.status(500).send(err.message);
  }
};
module.exports.deleteCommentPost = async (req, res) => {
  if (!ObjectID.isValid(req.params.id))
    return res.status(400).send("Utilisateur non trouvé : " + req.params.id);
  try {
    const commentDelete = await PostModel.findByIdAndUpdate(
      req.params.id,
      {
        $pull: {
          comments: {
            _id: req.body.commentId,
          },
        },
      },
      { new: true }
    );
    res.status(200).json(commentDelete);
  } catch (err) {
    console.error("Erreur lors de la suppression du commentaire :", err);
    res.status(500).json({ message: "Erreur serveur", error: err.message });
  }
};
