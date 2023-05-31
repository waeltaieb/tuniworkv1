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




router.get("/profile", (req, res) => {
  if (req.session.user) {
    const id = id_utilisateurs;
    const sql1 = `SELECT * FROM utilisateurs WHERE id = ?`;
    db.query(sql1, [id], (error, resultUtilisateurs) => {
      if (error) throw error;
      else {
        const sql2 = `SELECT * FROM freelance WHERE id_utilisatuers = ?`;
        db.query(sql2, [id], (error, resultFreelance) => {
          if (error) throw error;
          else {
            const id_freelance = resultFreelance[0].id;
            const sql3 = `SELECT * FROM competance WHERE id_freelance = ?`;
            db.query(sql3, [id_freelance], (error, resultComptance) => {
              if (error) throw error;
              else {

                res.render("profile", {
                  
                  utilisateurs: resultUtilisateurs[0],
                  freelance: resultFreelance[0],
                  comptance: resultComptance
                });
              }
            });
          }
        });
      }
    });
  } else {
    res.render("connexion");
  }
});
router.get("/ajout_post", (req, res) => {
  if (req.session.user) {
    res.render("ajout_post", { utilisateurs: req.session.user });
  } else {
    res.render("connexion");
  }
});
router.get("/parametre", (req, res) => {
  if (req.session.user) {
    const id = id_utilisateurs;
    const sql1 = `SELECT * FROM utilisateurs WHERE id = ?`;
    db.query(sql1, [id], (error, resultUtilisateurs) => {
      if (error) throw error;
      else {
        const sql2 = `SELECT * FROM freelance WHERE id_utilisatuers = ?`;
        db.query(sql2, [id], (error, resultFreelance) => {
          if (error) throw error;
          else {
            const id_freelance = resultFreelance[0].id;
            const sql3 = `SELECT * FROM competance WHERE id_freelance = ?`;
            db.query(sql3, [id_freelance], (error, resultComptance) => {
              if (error) throw error;
              else {

                res.render("param_freelance", {
                  
                  utilisateurs: resultUtilisateurs[0],
                  freelance: resultFreelance[0],
                  comptance: resultComptance
                });
              }
            });
          }
        });
      }

    });

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
    db.query(sql, [id], (error, result) => {
      if (error) { throw error; }
      else {
        const id_user = id_utilisateurs;
        const sql2 = `SELECT  offer.prix, offer.description, offer.date_offer, offer.id
        FROM utilisateurs
        INNER JOIN freelance ON utilisateurs.id = freelance.id_utilisatuers
        INNER JOIN offer ON freelance.id = offer.id_freelance
         WHERE utilisateurs.id = ? and offer.id_projet = ?`;
         db.query(sql2, [id_user, id], (error, resultsoffer) => {
          if (error) { throw error; }
          else {
            res.render("offer", {
              utilisateurs: req.session.user,
              projet: result[0],
              offer: resultsoffer
            });
          }
        });
      }
    });


  } else {
    res.render("connexion");
  }
});

router.get('/modifierOffer/:id', (req,res) => {
  if (req.session.user) {
    const id = id_utilisateurs;
    db.query('SELECT * FROM freelance WHERE id_utilisatuers = ?', [id], function (error, results, fields) {
      if(error){
        throw error;
      }else{
        const id_freelance = results[0].id;
        const id = req.params.id;
        const query = 'SELECT * FROM offer WHERE id = ? and id_freelance = ? ';
        db.query(query, [id, id_freelance], (error, result) =>{
          if (error) {
            console.error('Erreur lors de l\'exécution de la requête select :', error);
            res.status(500).send('Erreur interne du serveur');
            return;
          }else {
            const id_projet = result[0].id_projet;
            const sql = 'SELECT * FROM projet WHERE id = ? ';
            db.query(sql,[id_projet], (error, resultprojet) => {
              res.render("offerModifier", {
                utilisateurs: req.session.user,
                offer:result[0],
                projet:resultprojet[0]
              });
            })
          }
        });

      }
    });
  } else {
    res.redirect("/connexion");
  }
 });

router.post('/ajoutOffer', freelanceController.ajoutOffer);



module.exports = router;