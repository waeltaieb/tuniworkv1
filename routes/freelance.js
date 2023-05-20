const express = require('express');
const authController = require('../controllers/auth');

const router = express.Router();
const mysql = require('mysql');
const db = mysql.createConnection({
  host: process.env.DATABASE_HOST,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE,
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
router.post('/registerClient', authController.registerClient);
router.post('/parametre', authController.parametre);
router.post('/login', authController.login);
router.post('/modifier', authController.modifier);
router.get("/logout", authController.logout);


module.exports = router;