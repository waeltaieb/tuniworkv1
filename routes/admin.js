const express = require('express');
const adminController = require('../controllers/admin');

const router = express.Router();
const mysql = require('mysql');

const db = mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE,
});

router.get('/admin', (req, res) => {

    res.render('loginAdmin')
});


router.get('/admin/dashboard', (req, res) => {
    if (req.session.admin) {
        db.query('SELECT COUNT(*) AS totalUsers FROM utilisateurs', function (error, results, fields) {
            if (error) throw error;

            const totalUsers = results[0].totalUsers;

            db.query('SELECT COUNT(*) AS totalFreelancers FROM utilisateurs WHERE type_compte = ?', ['freelance'], function (error, results, fields) {
                if (error) throw error;

                const totalFreelancers = results[0].totalFreelancers;

                db.query('SELECT COUNT(*) AS totalClient FROM utilisateurs WHERE type_compte = ?', ['client'], function (error, results, fields) {
                    if (error) throw error;

                    const totalClient = results[0].totalClient;

                    db.query('SELECT COUNT(*) AS totalProjet FROM projet', function (error, results, fields) {
                        if (error) throw error;

                        const totalProjet = results[0].totalProjet;


                        res.render('index', {
                            utilisateurs: req.session.admin,
                            totalUsers: totalUsers,
                            totalFreelancers: totalFreelancers,
                            totalClient: totalClient,
                            totalProjet: totalProjet
                        });
                    });
                });
            });
        });

    } else {
        res.redirect("/admin");
    }
});

router.get('/listefreelancer', (req, res) => {
    if (req.session.admin) {
        const type = "freelance";
        const ban = 0;
        db.query('SELECT * FROM utilisateurs where type_compte=? AND ban = ?', [type, ban], function (error, results, fields) {

            if (error) throw error;

            res.render('listefreelancer', {
                tab: results,
                utilisateurs: req.session.admin,
            });

        });

    } else {
        res.redirect("/admin");
    }
});

router.get('/listeclient', (req, res) => {
    if (req.session.admin) {
        const type = "client";
        const ban = 0;
        db.query('SELECT * FROM utilisateurs where type_compte=? AND ban = ?', [type, ban], function (error, results, fields) {

            if (error) throw error;

            res.render('listeclient', {
                utilisateurs: req.session.admin,
                tab: results
            });

        });

    } else {
        res.redirect("/admin");
    }

});
router.get('/listeclientbloquer', (req, res) => {
    if (req.session.admin) {
        const type = "client";
        const ban = 1;
        db.query('SELECT * FROM utilisateurs where type_compte=? And ban = ?', [type, ban], function (error, results, fields) {

            if (error) throw error;

            res.render('listeclientbloquer', {
                utilisateurs: req.session.admin,
                tab: results
            });

        });

    } else {
        res.redirect("/admin");
    }
});
router.get('/listefreelancerbloquer', (req, res) => {
    if (req.session.admin) {
        const type = "freelance";
        const ban = 1;
        db.query('SELECT * FROM utilisateurs where type_compte=? And ban = ?', [type, ban], function (error, results, fields) {

            if (error) throw error;

            res.render('listefreelancerbloquer', {
                utilisateurs: req.session.admin,
                tab: results
            });

        });

    } else {
        res.redirect("/admin");
    }
});

router.get('/listeprojet', (req, res) => {
    if (req.session.admin) {
        db.query('SELECT utilisateurs.nom, utilisateurs.image_url, utilisateurs.prenom  , projet.id , projet.titre  , projet.description  , projet.prix  , projet.duree, projet.date_publier FROM utilisateurs INNER JOIN client ON utilisateurs.id = client.id_utilisateurs INNER JOIN projet ON client.id = projet.id_client', (error, results, fields) => {
            if (error) throw error;

            res.render('listeprojet', {
                utilisateurs: req.session.admin,
                projet: results
            });
        });

    } else {
        res.redirect("/admin");
    }

});
router.get('/paiement', (req, res) => {
    if (req.session.admin) {
        const type = "non verifier";
        db.query('SELECT * from payement where verification= ? ', [type], (error, results, fields) => {
            if (error) throw error;

            res.render('paiement', {
                utilisateurs: req.session.admin,
                Paiement: results
            });
        });
    } else {
        res.redirect("/admin");
    }

});

router.get('/consulterpaiement/:id', (req, res) => {
    if (req.session.admin) {
        const paymentId = req.params.id;

        const paymentQuery = `SELECT * from payement WHERE id = ?`;
        const projetQuery = `SELECT utilisateurs.nom, utilisateurs.image_url, utilisateurs.prenom  , projet.id , projet.titre  , projet.description  , projet.prix  , projet.duree, projet.date_publier 
  FROM utilisateurs INNER JOIN client ON utilisateurs.id = client.id_utilisateurs 
  INNER JOIN projet ON client.id = projet.id_client WHERE projet.id = ?`;
  
        const freelancerQuery = `
  SELECT  utilisateurs.image_url, utilisateurs.nom, utilisateurs.prenom,  offer.prix , offer.description , offer.date_offer  
  FROM utilisateurs
  INNER JOIN freelance ON utilisateurs.id = freelance.id_utilisatuers
  INNER JOIN offer ON freelance.id = offer.id_freelance 
   WHERE offer.id = ? 
  `;
        

        db.query(paymentQuery, [paymentId], (paymentError, paymentResults) => {
            if (paymentError) {throw paymentError;}
             else{
                const id_projet = paymentResults[0].id_projet;
                db.query(projetQuery, [id_projet], (projetError,projetResult) => {
                    if (projetError) {throw projetError;}
                    else{
                        const id_offer = paymentResults[0].id_offer;
                        db.query(freelancerQuery, [id_offer], (freelancerError,freelancerResult) => {
                            if (freelancerError) {throw freelancerError;}
                            else{
                                res.render('consulterpaiement', {
                                    utilisateurs: req.session.admin,
                                    payment: paymentResults[0],
                                    projet: projetResult[0],
                                    freelancer: freelancerResult[0],
                                    
                                  });
                            }
                        })
                    }
                })
             }
            
        });
    } else {
        res.redirect("/admin");
    }

});

router.get('/paiementaccepter', (req, res) => {
    if (req.session.admin) {
        const type = "verifier";
        db.query('SELECT * from payement where verification= ? ', [type], (error, results, fields) => {
            if (error) throw error;

            res.render('paiementaccepter', {
                utilisateurs: req.session.admin,
                Paiement: results
            });
        });

    } else {
        res.redirect("/admin");
    }

});

router.post('/cherchefreelancer', adminController.cherchefreelancer);
router.post('/ban', adminController.ban);
router.post('/banc', adminController.banc);
router.post('/listeclientbloquer', adminController.listeclientbloquer);
router.post('/suprrimer', adminController.suprrimer);
router.post('/debloquer', adminController.debloquer);
router.post('/suprrimer1', adminController.suprrimer1);
router.post('/debloquer1', adminController.debloquer1);
router.post('/listeprojet', adminController.listeprojet);
router.post('/supprimerprojet', adminController.supprimerprojet);
router.post('/paiement', adminController.paiement);
router.post('/accepter', adminController.accepter);
router.post('/envoyeralert', adminController.envoyeralert);

module.exports = router;