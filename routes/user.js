const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth");

router.post("/register", authController.signUp);
router.get("/test", (req, res) => {
  res.send("API OK");
});

module.exports = router;
