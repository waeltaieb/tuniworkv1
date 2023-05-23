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

router.get("/dashboard", (req, res) => {
    if (req.session.user) {
      const type = "en cour";
      const query = `
        SELECT  utilisateurs.nom, utilisateurs.prenom  , projet.id , projet.titre  , projet.description  , projet.prix  , projet.duree
        FROM utilisateurs
        INNER JOIN client ON utilisateurs.id = client.id_utilisateurs
        INNER JOIN projet ON client.id = projet.id_client
        WHERE projet.statut_projet = ?
      `;
      db.query(query, [type], function (error, results, fields) {
        if (error) {throw error;}
        else {
          res.render("freedashbord", {
             utilisateurs: req.session.user,
            projet:results });
        }
      });
      
    } else {
      res.redirect("/connexion");
    }
  });
  router.get("/dashboardClient", (req, res) => {
    if (req.session.userclient) {
      const type = "freelance";
      const query = `
        SELECT utilisateurs.id, utilisateurs.image_url, utilisateurs.nom, utilisateurs.prenom, freelance.categories
        FROM utilisateurs
        INNER JOIN freelance ON utilisateurs.id = freelance.id_utilisatuers
        WHERE utilisateurs.type_compte = ?
      `;
      db.query(query, [type], function (error, results, fields) {
        if (error) {
          throw error;
        } else {
          
              res.render("dashboardClient", {
                utilisateurs: req.session.userclient,
                freelances: results,
                
              });
        }
      });
    } else {
      res.redirect("/connexion");
    }
  });
  
  
  router.get("/connexion",  (req, res) => {
    if (req.session.user) {
      res.redirect("/dashboard");
    } else if (req.session.userclient) {
      res.redirect("/dashboardClient");
      
    } else  {
      res.render("connexion");
    }
  });
  router.get("/inscription",  (req, res) => {
    if (req.session.user) {
      res.redirect("/dashboard");
    } else if (req.session.userclient) {
      res.redirect("/dashboardClient");
    } else {
      res.render("inscription");
    }
  });
  router.get("/register",  (req, res) => {
    if (req.session.user) {
      res.redirect("/dashboard");
    } else if (req.session.userclient) {
      res.redirect("/dashboardClient");
    } else {
      res.render("register");
    }
  });
  router.get("/registerClient",  (req, res) => {
    if (req.session.user) {
      res.redirect("/dashboard");
    } else if (req.session.userclient) {
      res.redirect("/dashboardClient");
    } else {
      res.render("registerclient");
    }
  });



router.post('/register', authController.register);
router.post('/registerClient', authController.registerClient);
router.post('/parametre', authController.parametre);
router.post('/login', authController.login);
router.post('/modifier', authController.modifier);
router.get("/logout", authController.logout);


module.exports = router;