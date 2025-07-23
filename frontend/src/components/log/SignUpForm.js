import axios from "axios";
import React, { useState } from "react";
import SignInForm from "./SignInForm";

const SignUpForm = () => {
  const [formSubmit, setFormSubmit] = useState(false);
  const [pseudo, setPseudo] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [controlPassword, setControlPassword] = useState("");
  const [termsAccepted, setTermsAccepted] = useState(false);

  const [pseudoError, setPseudoError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [passwordConfirmError, setPasswordConfirmError] = useState("");
  const [termsError, setTermsError] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();

    // Réinitialiser les messages d'erreur
    setPseudoError("");
    setEmailError("");
    setPasswordError("");
    setPasswordConfirmError("");
    setTermsError("");

    if (password !== controlPassword || !termsAccepted) {
      if (password !== controlPassword) {
        setPasswordConfirmError("Les mots de passe ne correspondent pas");
      }
      if (!termsAccepted) {
        setTermsError("Veuillez valider les conditions générales");
      }
    } else {
      try {
        await axios.post(`${process.env.REACT_APP_API_URL}api/user/register`, {
          pseudo,
          email,
          password,
        });
        // Succès, redirection ou message
        console.log("Inscription réussie !");
        setFormSubmit(true);
      } catch (err) {
        if (err.response && err.response.data.errors) {
          const errors = err.response.data.errors;
          setPseudoError(errors.pseudo || "");
          setEmailError(errors.email || "");
          setPasswordError(errors.password || "");
        } else {
          console.log("Erreur inconnue :", err);
        }
      }
    }
  };

  return (
    <>
      {formSubmit ? (
        <>
          <SignInForm />
          <span></span>
          <h4 className="success">
            Enregistrement réussi, veuillez-vous connecter
          </h4>
        </>
      ) : (
        <form action="" onSubmit={handleRegister} id="sign-up-form">
          <label htmlFor="pseudo">Pseudo</label>
          <br />
          <input
            type="text"
            name="pseudo"
            id="pseudo"
            onChange={(e) => setPseudo(e.target.value)}
            value={pseudo}
          />
          <div className="pseudo error">{pseudoError}</div>
          <br />
          <label htmlFor="email">Email</label>
          <br />
          <input
            type="text"
            name="email"
            id="email"
            onChange={(e) => setEmail(e.target.value)}
            value={email}
          />
          <div className="email error">{emailError}</div>
          <br />
          <label htmlFor="password">Mot de passe</label>
          <br />
          <input
            type="password"
            name="password"
            id="password"
            onChange={(e) => setPassword(e.target.value)}
            value={password}
          />
          <div className="password error">{passwordError}</div>
          <br />
          <label htmlFor="password-conf">Confirmer le mot de passe</label>
          <br />
          <input
            type="password"
            name="password"
            id="password-conf"
            onChange={(e) => setControlPassword(e.target.value)}
            value={controlPassword}
          />
          <div className="password-confirm error">{passwordConfirmError}</div>
          <br />
          <input
            type="checkbox"
            id="terms"
            checked={termsAccepted}
            onChange={(e) => setTermsAccepted(e.target.checked)}
          />
          <label htmlFor="terms">
            J'accepte les
            <a href="/" target="_blank" rel="noopener noreferrer">
              {" "}
              conditions générales
            </a>
          </label>
          <div className="terms error">{termsError}</div>
          <input type="submit" value="Valider inscription" />
        </form>
      )}
    </>
  );
};

export default SignUpForm;
