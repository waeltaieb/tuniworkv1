const express = require('express');
const authController = require('../controllers/auth');

const router = express.Router();

router.get("/dashboarde", authController.isLoggedIn, (req, res) => {
    if (req.utilisateurs) {
      res.render("freedashbord", { utilisateurs: req.utilisateurs });
    } else {
      res.redirect("/connexion");
    }
  });
  router.get("/connexion", authController.isLoggedIn, (req, res) => {
    if (req.utilisateurs) {
      res.render("freedashbord", { utilisateurs: req.utilisateurs });
    } else {
      res.render("connexion");
    }
  });
  router.get("/inscription", authController.isLoggedIn, (req, res) => {
    if (req.utilisateurs) {
      res.render("freedashbord", { utilisateurs: req.utilisateurs });
    } else {
      res.render("inscription");
    }
  });
  router.get("/register", authController.isLoggedIn, (req, res) => {
    if (req.utilisateurs) {
      res.render("freedashbord", { utilisateurs: req.utilisateurs });
    } else {
      res.render("register");
    }
  });


router.post('/register', authController.register);
router.post('/login', authController.login);
router.get("/logout", authController.logout);


module.exports = router;