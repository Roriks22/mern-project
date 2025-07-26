const UserModel = require("../models/user");
const fs = require("fs");
const { uploadErrors } = require("../utils/errors");

module.exports.uploadProfil = async (req, res) => {
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

  const ext = req.file.mimetype.split("/")[1];
  const fileName = req.body.name + "." + ext;

  try {
    const uploadPath = `${__dirname}/../uploads/profil/`;
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    await fs.promises.writeFile(uploadPath + fileName, req.file.buffer);

    const photoModel = await UserModel.findByIdAndUpdate(
      req.body.userId,
      {
        $set: { picture: "uploads/profil/" + fileName },
      },
      { new: true, pusert: true, setDefaultsOnInsert: true }
    );
    res.status(200).json(photoModel);
  } catch (err) {
    console.error("Erreur lors de l'intégration de la photo :", err);
    res.status(500).json({ message: "Erreur serveur", error: err.message });
  }
};
