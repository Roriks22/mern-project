import React, { useState } from "react";
import axios from "axios";

const SignInForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();
    setEmailError("");
    setPasswordError("");

    axios({
      method: "post",
      url: `${process.env.REACT_APP_API_URL}api/user/login`,
      withCredentials: true,
      data: {
        email,
        password,
      },
    })
      .then((res) => {
        if (res.data.errors) {
          setEmailError(res.data.errors.email || "");
          setPasswordError(res.data.errors.password || "");
        } else {
          console.log("Connexion réussie !");
          window.location.href = "/";
        }
      })
      .catch((err) => {
        if (err.response && err.response.data.errors) {
          setEmailError(err.response.data.errors.email || "");
          setPasswordError(err.response.data.errors.password || "");
        } else {
          console.log("Erreur Axios:", err);
        }
      });
  };
  return (
    <form action="" onSubmit={handleLogin} id="sign-up-form">
      <label htmlFor="email">Email</label>
      <br />
      <input
        type="text"
        name="email"
        id="email"
        onChange={(e) => setEmail(e.target.value)}
        value={email}
      />
      {emailError && <div className="email error">{emailError}</div>}
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
      {passwordError && <div className="password error"> {passwordError}</div>}
      <input type="submit" value="Se connecter" />
    </form>
  );
};

export default SignInForm;
