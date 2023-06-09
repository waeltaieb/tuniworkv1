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

 router.get('/missionCour',(req,res) => {
  if (req.session.user) {
    const id = req.session.user.id;
    db.query('SELECT * FROM freelance WHERE id_utilisatuers = ?', [id], function (error, results, fields) {
      if(error){
        throw error;
      }else{
        const id_freelance = results[0].id;
        const statuProjet = "accepter";
        const sql =`SELECT * 
        FROM freelance
        INNER JOIN offer ON freelance.id = offer.id_freelance
        INNER JOIN projet ON projet.id = offer.id_projet
         WHERE offer.id_freelance = ? and projet.statut_projet = ? order by date_publier DESC`;
        db.query(sql, [id_freelance,statuProjet] , function (error, result, fields) {
          if(error){
            throw error;
          }else{
            const statuProjet = "accepter";
            const sql =`SELECT *  FROM projet_proposer WHERE id_freelance = ? and statut_projet = ? order by date_publier DESC`;
            db.query(sql, [id,statuProjet] , function (error, resultproposition, fields) {
              if(error){
                throw error;
              }else{
                
                res.render("missionCourfreelance", {
                  utilisateurs: req.session.user,
                  projet:result,
                  projetproposer:resultproposition
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

 router.get('/missiontermine',(req,res) => {
  if (req.session.user) {
    const id = req.session.user.id;
    db.query('SELECT * FROM freelance WHERE id_utilisatuers = ?', [id], function (error, results, fields) {
      if(error){
        throw error;
      }else{
        const id_freelance = results[0].id;
        const statuProjet = "terminer";
        const statuOffer= "terminer";
        const sql =`SELECT projet.id , projet.titre , projet.description , projet.prix , projet.duree 
        FROM offer
        INNER JOIN projet ON projet.id = offer.id_projet
         WHERE offer.id_freelance = ? and projet.statut_projet = ? and offer.statut_offer = ? order by date_publier DESC`;
        db.query(sql, [id_freelance,statuProjet,statuOffer] , function (error, result, fields) {
          if(error){
            throw error;
          }else{
           
            res.render("missionTerminerfreelance", {
              utilisateurs: req.session.user,
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

 router.get('/offerMission/:id', (req,res) => {
  if (req.session.user) {
    const id = req.session.user.id;
    db.query('SELECT * FROM freelance WHERE id_utilisatuers = ?', [id], function (error, results, fields) {
      if(error){
        throw error;
      }else{
        const id_freelance = results[0].id;
        const id = req.params.id;
        const query = 'SELECT * FROM projet WHERE id = ?  ';
        db.query(query, [id, id_freelance], (error, result) =>{
          if (error) {
            console.error('Erreur lors de l\'exécution de la requête select :', error);
            res.status(500).send('Erreur interne du serveur');
            return;
          }else {
            const id = req.params.id;
            const id_freelance = results[0].id;
            const statu = "accepter";
            const sql = `SELECT * FROM offer WHERE id_projet = ? and id_freelance = ?  and statut_offer = ?  `;
            db.query(sql, [id,id_freelance,statu], (error, resltoffer) =>{
              if (error) {
                console.error('Erreur lors de l\'exécution de la requête select :', error);
            res.status(500).send('Erreur interne du serveur');
            return;
              }else {
                
                res.render("voirOfferfreelance", {
                  utilisateurs: req.session.user,
                  projet:result[0],
                  offer:resltoffer[0]
                  
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

 router.get('/offerTerminee/:id', (req,res) => {
  if (req.session.user) {
    const id = req.session.user.id;
    db.query('SELECT * FROM freelance WHERE id_utilisatuers = ?', [id], function (error, results, fields) {
      if(error){
        throw error;
      }else{
        const id_freelance = results[0].id;
        const id = req.params.id;
        const query = 'SELECT * FROM projet WHERE id = ?  ';
        db.query(query, [id, id_freelance], (error, result) =>{
          if (error) {
            console.error('Erreur lors de l\'exécution de la requête select :', error);
            res.status(500).send('Erreur interne du serveur');
            return;
          }else {
            const id = req.params.id;
            const id_freelance = results[0].id;
            const statu = "terminer";
            const sql = `SELECT * FROM offer WHERE id_projet = ? and id_freelance = ?  and statut_offer = ?  `;
            db.query(sql, [id,id_freelance,statu], (error, resltoffer) =>{
              if (error) {
                console.error('Erreur lors de l\'exécution de la requête select :', error);
            res.status(500).send('Erreur interne du serveur');
            return;
              }else {
                
                res.render("offerTerminerfreelance", {
                  utilisateurs: req.session.user,
                  projet:result[0],
                  offer:resltoffer[0]
                  
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
 router.get('/Terminer/:id', (req, res) => {
  if (req.session.user) {
    const id = req.session.user.id;
    db.query('SELECT * FROM freelance WHERE id_utilisatuers = ?', [id], function (error, results, fields) {
      if (error) {
        throw error;
      } else {
        const statu = "en cour";
        const id = req.params.id;
        const query = 'UPDATE projet set statut_projet = ?  WHERE id = ? ';
        db.query(query, [statu, id], (error, result) => {
          if (error) {
            console.error('Erreur lors de l\'exécution de la requête select :', error);
            res.status(500).send('Erreur interne du serveur');
            return;
          } else { 
            const id = req.params.id;
            const query = 'DELETE from offer WHERE id_projet = ? ';
            db.query(query, [ id], (error, resultoffer) => {
              if (error) {
                console.error('Erreur lors de l\'exécution de la requête select :', error);
                res.status(500).send('Erreur interne du serveur');
                return;
              } else {
                const id = req.params.id;
                const query = 'DELETE from payement WHERE id_projet = ? ';
                db.query(query, [id], (error, resultpayement) => {
                  if (error) {
                    console.error('Erreur lors de l\'exécution de la requête select :', error);
                    res.status(500).send('Erreur interne du serveur');
                    return;
                  } else {
                    res.status(200).redirect("/dashboard");
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

router.get('/mission/:id',(req,res) => {
  if (req.session.user) {

    const id = req.session.user.id;
    db.query('SELECT * FROM freelance WHERE id_utilisatuers = ?', [id], function (error, results, fields) {
      if(error){
        throw error;
      }else{
        const id_projet = req.params.id;
        const statuProjet = "en cour";
        const sql =`SELECT *  FROM projet_proposer WHERE id = ? and id_freelance = ? and statut_projet = ?  `;
        db.query(sql, [id_projet,id,statuProjet] , function (error, result, fields) {
          if(error){
            throw error;
          }else{
            const id_client = result[0].id_client;
            const sql =`SELECT utilisateurs.nom, utilisateurs.prenom
              FROM utilisateurs
              INNER JOIN client ON utilisateurs.id = client.id_utilisateurs
              WHERE client.id = ? `;
            db.query(sql, [id_client] , function (error, resultclient, fields) {
              if(error){
                throw error;
              }else{
                res.render("mission", {
                  utilisateurs: req.session.user,
                  projet:result[0],
                  client:resultclient[0]
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

 router.get('/accepteprojet/:id',(req,res) => {
  if (req.session.user) {
    const id_projet = req.params.id;
    const id = req.session.user.id;
    const statuProjet = "accepter";
    db.query('select * FROM projet_proposer WHERE id = ? and id_freelance = ? ', [id_projet,id], function (error, results, fields) {
      if(error){
        throw error;
      }else{
        db.query('UPDATE projet_proposer SET  statut_projet = ? WHERE id = ? and id_freelance = ?',[statuProjet,id_projet,id], function (error, resultupddate, fields) {
          if(error){
            throw error;
          }else{
            res.status(200).redirect("/missionCour");
          }
        });
      }
    });
    
  } else {
    res.redirect("/connexion");
  }

 });

 router.get('/refusserprojet/:id',(req,res) => {
  if (req.session.user) {
    const id_projet = req.params.id;
    const id = req.session.user.id;
    const statuProjet = "refuser";
    db.query('select * FROM projet_proposer WHERE id = ? and id_freelance = ? ', [id_projet,id], function (error, results, fields) {
      if(error){
        throw error;
      }else{
        db.query('UPDATE projet_proposer SET  statut_projet = ? WHERE id = ? and id_freelance = ?',[statuProjet,id_projet,id], function (error, resultupddate, fields) {
          if(error){
            throw error;
          }else{
            res.status(200).redirect("/missionCour");
          }
        });
      }
    });
    
  } else {
    res.redirect("/connexion");
  }

 });

router.post('/ajoutOffer', freelanceController.ajoutOffer);
router.post('/ajoutcv', freelanceController.ajoutcv);



module.exports = router;