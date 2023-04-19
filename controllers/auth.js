const mysql = require('mysql');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const db = mysql.createConnection({
  host: process.env.DATABASE_HOST,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE,
});

exports.register = async (req, res) => {
  const { nom, prenom, pseudo, email, mot_de_passe, confirm_mot_de_passe, date_nai } = req.body;
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
      { nom: nom, prenom: prenom, pseudo: pseudo, email: email, mot_de_passe: hash_mot_de_passe },
      (error, results) => {
        if (error) {
          console.log(error);
          return res.render('register', {
            message: 'Erreur serveur, veuillez réessayer ultérieurement',
          });
        } else {
          return res.render('connexion');
        }
      }
    );
  });
};
