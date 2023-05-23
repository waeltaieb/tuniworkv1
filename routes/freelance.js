const express = require('express');
const authController = require('../controllers/auth');
const freelanceController = require('../controllers/freelance');

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
  router.get("/offer/:id", (req, res) => {
    if (req.session.user) {
      const id = req.params.id;
      const sql = `SELECT  utilisateurs.nom, utilisateurs.prenom  , projet.id , projet.titre  , projet.description  , projet.prix  , projet.duree, projet.domaine
      FROM utilisateurs
      INNER JOIN client ON utilisateurs.id = client.id_utilisateurs
      INNER JOIN projet ON client.id = projet.id_client
       WHERE projet.id = ?`;
      db.query(sql,[id],(error, result ) => {
        if (error) {throw error;}
        else {
          res.render("offer", { 
          utilisateurs: req.session.user,
          projet:result[0]
         });
        }
      })

      
    } else {
      res.render("connexion");
    }
  });

router.post('/ajoutOffer', freelanceController.ajoutOffer);
router.post('/register', authController.register);
router.post('/registerClient', authController.registerClient);
router.post('/parametre', authController.parametre);
router.post('/login', authController.login);
router.post('/modifier', authController.modifier);
router.get("/logout", authController.logout);


module.exports = router;