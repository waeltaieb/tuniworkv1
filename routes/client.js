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
        db.query('SELECT * FROM freelance WHERE id_utilisatuers = ?', [id], function (error, result, fields) {

          if (error) {
            throw error;
          } else {
            db.query('SELECT * FROM competance WHERE id_freelance = ?', [result[0].id], function (error, reslt, fields) {

              if (error) {
                throw error;
              } else {
                res.render("choix", {
                  utilisateurs: req.session.userclient,
                  utilisateur: results[0],
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
router.get('/ajoutMission', (req, res) => {
  if (req.session.userclient) {
    res.render("ajoutMission", {
      utilisateurs: req.session.userclient,
    });

  } else {
    res.redirect("/connexion");
  }

});

router.get('/missionEncour', (req, res) => {
  if (req.session.userclient) {
    const id = req.session.userclient.id;
    db.query('SELECT * FROM client WHERE id_utilisateurs = ?', [id], function (error, results, fields) {
      if (error) {
        throw error;
      } else {
        const id_client = results[0].id;
        const statuProjet = "accepter"
        db.query('SELECT * FROM projet WHERE id_client = ? and statut_projet = ? order by date_publier DESC', [id_client, statuProjet], function (error, result, fields) {
          if (error) {
            throw error;
          } else {
            res.render("missionCour", {
              utilisateurs: req.session.userclient,
              projet: result,
            });

          }
        });
      }
    });

  } else {
    res.redirect("/connexion");
  }

});
router.get('/listMission', (req, res) => {
  if (req.session.userclient) {
    const id = id_utilisateurs;
    db.query('SELECT * FROM client WHERE id_utilisateurs = ?', [id], function (error, results, fields) {
      if (error) {
        throw error;
      } else {
        const id_client = results[0].id;
        const statuProjet = "en cour"
        db.query('SELECT * FROM projet WHERE id_client = ? and statut_projet = ? order by date_publier DESC', [id_client, statuProjet], function (error, result, fields) {
          if (error) {
            throw error;
          } else {
            const query = `
            SELECT  projet.id, offer.date_offer
            FROM projet
            INNER JOIN offer ON projet.id = offer.id_projet
            WHERE projet.id_client = ? order by offer.date_offer DESC
          `;
            db.query(query, [id_client], function (error, resultsoffer, fields) {
              if (error) {
                throw error;
              } else {
                const statu = "accepter";
                const query = ` SELECT  * FROM projet_proposer WHERE id_client = ? and statut_projet = ? order by date_publier DESC `;
                db.query(query, [id_client, statu], function (error, resultsmissionacc, fields) {
                  if (error) {
                    throw error;
                  } else {
                    const statu = "refuser";
                    const query = ` SELECT  * FROM projet_proposer WHERE id_client = ? and statut_projet = ? order by date_publier DESC `;
                    db.query(query, [id_client, statu], function (error, resultsmissionrefus, fields) {
                      if (error) {
                        throw error;
                      } else {
                        res.render("listeMission", {
                          utilisateurs: req.session.userclient,
                          projet: result,
                          notification: resultsoffer,
                          missionAccept: resultsmissionacc,
                          missionRefuse: resultsmissionrefus
                        });

                      }
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
router.get('/missionTerminer', (req, res) => {
  if (req.session.userclient) {
    const id = req.session.userclient.id;
    db.query('SELECT * FROM client WHERE id_utilisateurs = ?', [id], function (error, results, fields) {
      if (error) {
        throw error;
      } else {
        const id_client = results[0].id;
        const statuProjet = "terminer"
        db.query('SELECT * FROM projet WHERE id_client = ? and statut_projet = ? order by date_publier DESC', [id_client, statuProjet], function (error, result, fields) {
          if (error) {
            throw error;
          } else {
            res.render("missionTerminer", {
              utilisateurs: req.session.userclient,
              projet: result,
            });

          }
        });
      }
    });

  } else {
    res.redirect("/connexion");
  }
});
router.get('/supprimer/:id', (req, res) => {
  if (req.session.userclient) {
    const id = req.session.userclient.id;
    db.query('SELECT * FROM client WHERE id_utilisateurs = ?', [id], function (error, results, fields) {
      if (error) {
        throw error;
      } else {
        const id_client = results[0].id;
        const id = req.params.id;
        const query = 'DELETE FROM projet WHERE id = ? and id_client = ?';
        db.query(query, [id, id_client], (error, results) => {
          if (error) {
            console.error('Erreur lors de l\'exécution de la requête DELETE :', error);
            res.status(500).send('Erreur interne du serveur');
            return;
          } else {
            res.redirect("/listMission");
          }
        });

      }
    });
  } else {
    res.redirect("/connexion");
  }
});

router.get('/modifier/:id', (req, res) => {
  if (req.session.userclient) {
    const id = req.session.userclient.id;
    db.query('SELECT * FROM client WHERE id_utilisateurs = ?', [id], function (error, results, fields) {
      if (error) {
        throw error;
      } else {
        const id_client = results[0].id;
        const id = req.params.id;
        const query = 'SELECT * FROM projet WHERE id = ? and id_client = ? ';
        db.query(query, [id, id_client], (error, results) => {
          if (error) {
            console.error('Erreur lors de l\'exécution de la requête select :', error);
            res.status(500).send('Erreur interne du serveur');
            return;
          } else {
            res.render("modifierMission", {
              utilisateurs: req.session.userclient,
              projet: results[0],
            });
          }
        });

      }
    });
  } else {
    res.redirect("/connexion");
  }
});
router.get('/voirMission/:id', (req, res) => {
  if (req.session.userclient) {
    const id = req.session.userclient.id;
    db.query('SELECT * FROM client WHERE id_utilisateurs = ?', [id], function (error, results, fields) {
      if (error) {
        throw error;
      } else {
        const id_client = results[0].id;
        const id = req.params.id;
        const query = 'SELECT * FROM projet WHERE id = ? and id_client = ? ';
        db.query(query, [id, id_client], (error, result) => {
          if (error) {
            console.error('Erreur lors de l\'exécution de la requête select :', error);
            res.status(500).send('Erreur interne du serveur');
            return;
          } else {
            const id_projet = result[0].id;
            const sql = ` SELECT utilisateurs.id, utilisateurs.image_url, utilisateurs.nom, utilisateurs.prenom, offer.id AS offre_id, offer.prix , offer.description , offer.date_offer  
            FROM utilisateurs
            INNER JOIN freelance ON utilisateurs.id = freelance.id_utilisatuers
            INNER JOIN offer ON freelance.id = offer.id_freelance 
             WHERE id_projet = ?  `;
            db.query(sql, [id_projet], (error, resltoffer) => {
              if (error) {
                console.error('Erreur lors de l\'exécution de la requête select :', error);
                res.status(500).send('Erreur interne du serveur');
                return;
              } else {
                res.render("voirMission", {
                  utilisateurs: req.session.userclient,
                  projet: result[0],
                  offers: resltoffer
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


router.get('/voirofferMission/:id', (req, res) => {
  if (req.session.userclient) {
    const id = req.session.userclient.id;
    db.query('SELECT * FROM client WHERE id_utilisateurs = ?', [id], function (error, results, fields) {
      if (error) {
        throw error;
      } else {
        const id_client = results[0].id;
        const id = req.params.id;
        const query = 'SELECT * FROM projet WHERE id = ? and id_client = ? ';
        db.query(query, [id, id_client], (error, result) => {
          if (error) {
            console.error('Erreur lors de l\'exécution de la requête select :', error);
            res.status(500).send('Erreur interne du serveur');
            return;
          } else {
            const id = req.params.id;
            const statu = "accepter";
            const sql = ` SELECT utilisateurs.id, utilisateurs.image_url, utilisateurs.nom, utilisateurs.prenom, offer.id AS offre_id, offer.prix , offer.description , offer.date_offer  
            FROM utilisateurs
            INNER JOIN freelance ON utilisateurs.id = freelance.id_utilisatuers
            INNER JOIN offer ON freelance.id = offer.id_freelance 
             WHERE id_projet = ? and statut_offer = ? `;

            db.query(sql, [id, statu], (error, resltoffer) => {
              if (error) {
                console.error('Erreur lors de l\'exécution de la requête select :', error);
                res.status(500).send('Erreur interne du serveur');
                return;
              } else {
                
                res.render("voirOffer", {
                  utilisateurs: req.session.userclient,
                  projet: result[0],
                  offer: resltoffer[0]

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

router.get('/offerTerminer/:id', (req, res) => {
  if (req.session.userclient) {
    const id = req.session.userclient.id;
    db.query('SELECT * FROM client WHERE id_utilisateurs = ?', [id], function (error, results, fields) {
      if (error) {
        throw error;
      } else {
        const id_client = results[0].id;
        const id = req.params.id;
        const query = 'SELECT * FROM projet WHERE id = ? and id_client = ? ';
        db.query(query, [id, id_client], (error, result) => {
          if (error) {
            console.error('Erreur lors de l\'exécution de la requête select :', error);
            res.status(500).send('Erreur interne du serveur');
            return;
          } else {
            const id_projet = result[0].id;
            const sql = ` SELECT * from payement WHERE id_projet = ?  `;
            db.query(sql, [id_projet], (error, resltpayment) => {
              if (error) {
                console.error('Erreur lors de l\'exécution de la requête select :', error);
                res.status(500).send('Erreur interne du serveur');
                return;
              } else {
                const id_offer = resltpayment[0].id_offer;
                const sql = `  SELECT utilisateurs.id, utilisateurs.image_url, utilisateurs.nom, utilisateurs.prenom, offer.id AS offre_id, offer.prix , offer.description , offer.date_offer  
                FROM utilisateurs
                INNER JOIN freelance ON utilisateurs.id = freelance.id_utilisatuers
                INNER JOIN offer ON freelance.id = offer.id_freelance 
                 WHERE offer.id = ?   `;
                db.query(sql, [id_offer], (error, resltoffer) => {
                  if (error) {
                    console.error('Erreur lors de l\'exécution de la requête select :', error);
                    res.status(500).send('Erreur interne du serveur');
                    return;
                  } else {

                    res.render("offerTerminer", {
                      utilisateurs: req.session.userclient,
                      projet: result[0],
                      offer: resltoffer[0]

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
router.get('/Terminer/:id', (req, res) => {
  if (req.session.userclient) {
    const id = req.session.userclient.id;
    db.query('SELECT * FROM client WHERE id_utilisateurs = ?', [id], function (error, results, fields) {
      if (error) {
        throw error;
      } else {
        const statu = "terminer";
        const id_client = results[0].id;
        const id = req.params.id;
        const query = 'UPDATE projet set statut_projet =?  WHERE id = ? and id_client = ? ';
        db.query(query, [statu, id, id_client], (error, result) => {
          if (error) {
            console.error('Erreur lors de l\'exécution de la requête select :', error);
            res.status(500).send('Erreur interne du serveur');
            return;
          } else {
            const statu_offer = "terminer";
            const id = req.params.id;
            const query = 'UPDATE offer set statut_offer = ?  WHERE id_projet = ? ';
            db.query(query, [statu_offer, id], (error, resultoffer) => {
              if (error) {
                console.error('Erreur lors de l\'exécution de la requête select :', error);
                res.status(500).send('Erreur interne du serveur');
                return;
              } else {
                res.status(200).redirect("/missionTerminer");
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
router.get('/proposerMission/:freelance_id', (req, res) => {
  if (req.session.userclient) {
    const id = req.params.freelance_id;

    db.query('SELECT * FROM utilisateurs WHERE id = ?', [id], function (error, results, fields) {

      if (error) {
        throw error;
      } else {
        db.query('SELECT * FROM freelance WHERE id_utilisatuers = ?', [id], function (error, result, fields) {

          if (error) {
            throw error;
          } else {
            db.query('SELECT * FROM competance WHERE id_freelance = ?', [result[0].id], function (error, reslt, fields) {

              if (error) {
                throw error;
              } else {
                res.render("proposeMission", {
                  utilisateurs: req.session.userclient,
                  utilisateur: results[0],
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

router.post('/modifiermission', clientController.modifiermission);
router.post('/ajoutmission', clientController.ajoutmission);
router.post('/proposerMission', clientController.proposerMission);
router.post('/paiment', clientController.paiment);



module.exports = router;