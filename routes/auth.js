const express = require('express');
const authController = require('../controllers/auth');

const router = express.Router();

router.get("/dashboard", (req, res) => {
    if (req.session.user) {
      res.render("freedashbord", { utilisateurs: req.session.user });
    } else {
      res.redirect("/connexion");
    }
  });
  router.get("/connexion",  (req, res) => {
    if (req.session.user) {
      res.render("freedashbord", { utilisateurs: req.session.user });
    } else {
      res.render("connexion");
    }
  });
  router.get("/inscription",  (req, res) => {
    if (req.session.user) {
      res.render("freedashbord", { utilisateurs: req.session.user });
    } else {
      res.render("inscription");
    }
  });
  router.get("/register",  (req, res) => {
    if (req.session.user) {
      res.render("freedashbord", { utilisateurs: req.session.user });
    } else {
      res.render("register");
    }
  });



  router.get("/profile",  (req, res) => {
    if (req.session.user) {
      res.render("profile", { utilisateurs: req.session.user, freelance: freelance, comptance:comptance });
    } else {
      res.render("connexion");
    }
  });
  router.get("/ajout_post",  (req, res) => {
    if (req.session.user) {
      res.render("ajout_post", { utilisateurs: req.session.user });
    } else {
      res.render("connexion");
    }
  });
  router.get("/parametre",  (req, res) => {
    if (req.session.user) {
      res.render("param_freelance", { utilisateurs: req.session.user, freelance: freelance, comptance:comptance });
    } else {
      res.render("connexion");
    }
  });
  router.get("/messagerie", (req, res) => {
    if (req.session.user) {
      res.render("messagerie", { utilisateurs: req.session.user });
    } else {
      res.render("connexion");
    }
  });
  router.get("/offer", (req, res) => {
    if (req.session.user) {
      res.render("offer", { utilisateurs: req.session.user });
    } else {
      res.render("connexion");
    }
  });


router.post('/register', authController.register);
router.post('/parametre', authController.parametre);
router.post('/login', authController.login);
router.post('/modifier', authController.modifier);
router.get("/logout", authController.logout);


module.exports = router;