const mysql = require('mysql');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { promisify } = require("util");
const session = require('express-session');
var multer = require('multer');

const db = mysql.createConnection({
  host: process.env.DATABASE_HOST,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE,
});

exports.register = async (req, res) => {
  const { nom, prenom, pseudo, email, mot_de_passe, confirm_mot_de_passe, date_nai } = req.body;
  const type = "freelance";
  db.query('SELECT * FROM utilisateurs WHERE email = ?', [email], async (error, results) => {
    if (error) {
      console.log(error);
      return res.render('register', {
        message: 'Erreur serveur, veuillez réessayer ultérieurement',
      });
    }

    if (results.length > 0) {
      return res.render('register', {
        message: 'Email non valide',
      });
    } else if (mot_de_passe !== confirm_mot_de_passe) {
      return res.render('register', {
        message: 'Veuillez vérifier votre mot de passe',
      });
    }

    let hash_mot_de_passe = await bcrypt.hash(mot_de_passe, 8);

    db.query(
      'INSERT INTO utilisateurs SET ?',
      { nom: nom, prenom: prenom, pseudo: pseudo, email: email, mot_de_passe: hash_mot_de_passe, date_nai: date_nai, type_compte: type },
      (error, results) => {
        if (error) {
          console.log(error);
          return res.render('register', {
            message: 'Erreur serveur, veuillez réessayer ultérieurement',
          });
        } else {
          db.query('SELECT * FROM utilisateurs where email = ? ', [email], (error, results) => {
            if (error) throw error;
            return res.render('complement', {
              utilisateurs: results[0]
            });
          });

        }
      }
    );
  });
};
exports.ajoutOffer = (req, res) => {
  const { id_projet,id_utilisateur,description, montant } = req.body;
  const currentDate = new Date().toISOString().slice(0, 16).replace('T', ' ');

  db.query('SELECT * FROM freelance WHERE id_utilisatuers  = ?', [id_utilisateur],  (error, results) => {
    if (error) {
      throw error;
    } else {
      const id_freelance = results[0].id;
      db.query(
        'INSERT INTO offer SET ?',
        { id_freelance: id_freelance, id_projet : id_projet , description: description, prix: montant,date_offer: currentDate },
        (error, result) => {
          if (error) {
            console.log(error);
           
          } else {
            res.status(200).redirect("/dashboard");
  
          }
        }
      );
    }

  })

};