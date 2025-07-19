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

  if (err.message.includes("email")) errors.email = "Email inconnu";
  if (err.message.includes("password"))
    errors.password = "Le mot de passe ne correspond pas";

  return errors;
};
