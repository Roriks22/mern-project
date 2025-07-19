const jwt = require("jsonwebtoken");
const UserModel = require("../models/user");

module.exports.checkUser = (req, res, next) => {
  const token = req.cookies.jwt;
  if (token) {
    jwt.verify(token, process.env.TOKEN_SECRET, async (err, decodedToken) => {
      if (err) {
        res.locals.user = null;
        res.cookie("jwt", "", { maxAge: 1 });
        next();
      } else {
        let user = await UserModel.findById(decodedToken.id);
        res.locals.user = user;
        console.log(res.locals.user);
        next();
      }
    });
  } else {
    res.locals.user = null;
    next();
  }
};

module.exports.requireAuth = (req, res, next) => {
  const token = req.cookies.jwt;
  if (token) {
    jwt.verify(token, process.env.TOKEN_SECRET, (err, decodedToken) => {
      if (err) {
        console.log("Token invalide :", err.message);
        return res.status(401).json({ error: "Token invalide" });
      } else {
        req.user = decodedToken.id;
        next();
      }
    });
  } else {
    return res.status(401).json({ error: "Accès refusé. Token refusé." });
  }
};
