const express = require('express');


const router = express.Router();
const mysql = require('mysql');

const db = mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE,
});

router.get('/', (req, res) => {
    res.render('home')
});
router.get('/acceuil', (req, res) => {
    res.render('home')
});



router.get('/profile-freelance', (req, res) => {
    const type = "freelance";
    const query = `
      SELECT utilisateurs.id, utilisateurs.image_url, utilisateurs.nom, utilisateurs.prenom, freelance.categories, freelance.discription
      FROM utilisateurs
      INNER JOIN freelance ON utilisateurs.id = freelance.id_utilisatuers
      WHERE utilisateurs.type_compte = ?  ORDER BY RAND ()
    `;
    db.query(query, [type], function (error, results, fields) {
        if (error) {
            throw error;
        } else {
            res.render("profile-freelance", {

                freelances: results,

            });

        }
    })

});

router.get('/client', (req, res) => {
    const type = "en cour";
    const query = `
      SELECT  utilisateurs.nom, utilisateurs.prenom  , projet.id , projet.titre  , projet.description  , projet.prix  , projet.duree, projet.date_publier
      FROM utilisateurs
      INNER JOIN client ON utilisateurs.id = client.id_utilisateurs
      INNER JOIN projet ON client.id = projet.id_client
      WHERE projet.statut_projet = ? order by date_publier DESC
    `;
    db.query(query, [type], function (error, results, fields) {
        if (error) {
            throw error;
        } else {
            res.render("client", {

                projet: results,

            });

        }
    })

});




router.get('/contact', (req, res) => {
    res.render('contact')
});

module.exports = router;