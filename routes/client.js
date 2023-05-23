const express = require('express');
const authController = require('../controllers/auth');
const clientController = require('../controllers/client');

const router = express.Router();
const mysql = require('mysql');
const db = mysql.createConnection({
  host: process.env.DATABASE_HOST,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE,
});


router.get('/profile/:freelance_id', (req, res) => {
  if (req.session.userclient) {
      const id = req.params.freelance_id;

      db.query('SELECT * FROM utilisateurs WHERE id = ?', [id], function (error, results, fields) {

      if (error) {
          throw error;
      } else {
          db.query('SELECT * FROM freelance WHERE id_utilisatuers = ?', [id] , function (error, result, fields) {

              if (error) {
                  throw error;
              } else {
                  db.query('SELECT * FROM competance WHERE id_freelance = ?', [result[0].id] , function (error, reslt , fields) {

                      if (error) {
                          throw error;
                      } else {
                          res.render("choix", {
                              utilisateurs: req.session.userclient,
                              utilisateur:results[0],
                              freelances: result[0],
                              competance: reslt
                              
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
 router.get('/ajoutMission',(req,res) => {
  if (req.session.userclient) {
    res.render("ajoutMission", {
      utilisateurs: req.session.userclient,
    });

  } else {
    res.redirect("/connexion");
  }

 });

 router.get('/listMission',(req,res) => {
  if (req.session.userclient) {
    const id = req.session.userclient.id;
    db.query('SELECT * FROM client WHERE id_utilisateurs = ?', [id], function (error, results, fields) {
      if(error){
        throw error;
      }else{
        const id_client = results[0].id;
        db.query('SELECT * FROM projet WHERE id_client = ?', [id_client] , function (error, result, fields) {
          if(error){
            throw error;
          }else{
            res.render("listeMission", {
              utilisateurs: req.session.userclient,
              projet:result,
            });
        
          }
        });
      }
    });
    
  } else {
    res.redirect("/connexion");
  }

 });

 router.get('/supprimer/:id', (req,res) => {
  if (req.session.userclient) {
    const id = req.session.userclient.id;
    db.query('SELECT * FROM client WHERE id_utilisateurs = ?', [id], function (error, results, fields) {
      if(error){
        throw error;
      }else{
        const id_client = results[0].id;
        const id = req.params.id;
        const query = 'DELETE FROM projet WHERE id = ? and id_client = ?';
        db.query(query, [id, id_client ], (error, results) =>{
          if (error) {
            console.error('Erreur lors de l\'exécution de la requête DELETE :', error);
            res.status(500).send('Erreur interne du serveur');
            return;
          }else {
            res.redirect("/listMission");
          }
        });

      }
    });
  } else {
    res.redirect("/connexion");
  }
 });

 router.get('/modifier/:id', (req,res) => {
  if (req.session.userclient) {
    const id = req.session.userclient.id;
    db.query('SELECT * FROM client WHERE id_utilisateurs = ?', [id], function (error, results, fields) {
      if(error){
        throw error;
      }else{
        const id_client = results[0].id;
        const id = req.params.id;
        const query = 'SELECT * FROM projet WHERE id = ? and id_client = ? ';
        db.query(query, [id, id_client], (error, results) =>{
          if (error) {
            console.error('Erreur lors de l\'exécution de la requête select :', error);
            res.status(500).send('Erreur interne du serveur');
            return;
          }else {
            res.render("modifierMission", {
              utilisateurs: req.session.userclient,
              projet:results[0],
            });
          }
        });

      }
    });
  } else {
    res.redirect("/connexion");
  }
 });
 router.get('/voirMission/:id', (req,res) => {
  if (req.session.userclient) {
    const id = req.session.userclient.id;
    db.query('SELECT * FROM client WHERE id_utilisateurs = ?', [id], function (error, results, fields) {
      if(error){
        throw error;
      }else{
        const id_client = results[0].id;
        const id = req.params.id;
        const query = 'SELECT * FROM projet WHERE id = ? and id_client = ? ';
        db.query(query, [id, id_client], (error, result) =>{
          if (error) {
            console.error('Erreur lors de l\'exécution de la requête select :', error);
            res.status(500).send('Erreur interne du serveur');
            return;
          }else {
            const id_projet = result[0].id;
            const sql = ` SELECT utilisateurs.id, utilisateurs.image_url, utilisateurs.nom, utilisateurs.prenom, offer.prix , offer.description , offer.date_offer  
            FROM utilisateurs
            INNER JOIN freelance ON utilisateurs.id = freelance.id_utilisatuers
            INNER JOIN offer ON freelance.id = offer.id_freelance 
             WHERE id_projet = ?  `;
            db.query(sql, [id_projet], (error, resltoffer) =>{
              if (error) {
                console.error('Erreur lors de l\'exécution de la requête select :', error);
            res.status(500).send('Erreur interne du serveur');
            return;
              }else {
                res.render("voirMission", {
                  utilisateurs: req.session.userclient,
                  projet:result[0],
                  offers:resltoffer
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


router.post('/modifiermission', clientController.modifiermission);
router.post('/ajoutmission', clientController.ajoutmission);
router.post('/register', authController.register);
router.post('/registerClient', authController.registerClient);
router.post('/parametre', authController.parametre);
router.post('/login', authController.login);
router.post('/modifier', authController.modifier);
router.get("/logout", authController.logout);


module.exports = router;