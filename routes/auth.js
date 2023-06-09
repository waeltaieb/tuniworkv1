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
      const id = id_utilisateurs;
      const sql1 = `SELECT * FROM utilisateurs WHERE id = ?`;
      db.query(sql1, [id], (error, resultUtilisateurs) => {
        if (error) throw error;
        else {
          const type = "en cour";
          const query = `
            SELECT  utilisateurs.nom, utilisateurs.prenom  , projet.id , projet.titre  , projet.description  , projet.prix  , projet.duree, projet.date_publier
            FROM utilisateurs
            INNER JOIN client ON utilisateurs.id = client.id_utilisateurs
            INNER JOIN projet ON client.id = projet.id_client
            WHERE projet.statut_projet = ? order by date_publier DESC
          `;
          db.query(query, [type], function (error, results, fields) {
            if (error) {throw error;}
            else {
              const statu = "en cour";
              const query = ` SELECT * FROM projet_proposer WHERE id_freelance = ? and statut_projet = ?  order by date_publier DESC `;
              db.query(query, [id,statu], function (error, resultsNotification, fields) {
                if (error) {throw error;}
                else {
                  const typeoffer = "accepter"; 
                  const query = ` SELECT offer.id_projet
                  FROM utilisateurs
                  INNER JOIN freelance ON utilisateurs.id = freelance.id_utilisatuers
                  INNER JOIN offer ON freelance.id = offer.id_freelance
                  WHERE utilisateurs.id = ? and statut_offer = ?  order by date_offer DESC `;
                  db.query(query, [id,typeoffer], function (error, resultsAccept, fields) {
                    if (error) {throw error;}
                    else {
                      res.render("freedashbord", {
                         utilisateurs: resultUtilisateurs[0],
                         projet:results,
                         notification: resultsNotification,
                         notificationAccept: resultsAccept
                        });
                    }
                  });
                }
              });
            }
          });
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
router.post('/parametreClient', authController.parametreClient);
router.post('/parametre', authController.parametre);
router.post('/login', authController.login);
router.post('/modifier', authController.modifier);
router.get("/logout", authController.logout);


module.exports = router;