module.exports.signUpErrors = (err) => {
  let errors = { pseudo: "", email: "", password: "" };

  if (err.errors) {
    if (err.errors.pseudo) {
      errors.pseudo = "Pseudo incorrect ou déjà pris.";
    }
    if (err.errors.email) {
      errors.email = "Email incorrect.";
    }
    if (err.errors.password) {
      errors.password = "Le mot de passe doit faire 6 caractères minimum.";
    }
  }
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    if (field === "pseudo") errors.pseudo = "Ce pseudo est déjà pris.";
    if (field === "email") errors.email = "Cet email est déjà enregistré.";
  }
  return errors;
};

module.exports.signInErrors = (err) => {
  let errors = { email: "", password: "" };
  if (err.message === "Email incorrect") errors.email = "Email inconnu";
  if (err.message === "Mot de passe incorrect")
    errors.password = "Mot de passe incorrect";
  return errors;
};

module.exports.uploadErrors = (err) => {
  let errors = { format: "", maxSize: "" };

  if (err.message.includes("invalid file"))
    errors.format = "Format incompatible";

  if (err.message.includes("max size"))
    errors.maxSize = "Le fichier dépasse 600Ko";

  return errors;
};
