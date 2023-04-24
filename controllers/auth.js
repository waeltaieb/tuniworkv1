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

exports.login = async (req, res) => {
    try {
      const { email, mot_de_passe } = req.body;
      if (!email || !mot_de_passe) {
        return res.status(400).render("connexion", {
            message: "SVP Ecrire voutre Email et  Mot de passe",
          
        });
      }
  
      db.query(
        "select * from utilisateurs where email=?",
        [email],
        async (error, result) => {
          
          if (result.length <= 0) {
            return res.status(401).render("connexion", {
                message: "SVP Ecrire voutr Email et  Mot de passe",
              
            });
          } else {
            if (!(await bcrypt.compare(mot_de_passe, result[0].mot_de_passe))) {
              return res.status(401).render("connexion", {
                message: "SVP Ecrire voutr Email et  Mot de passe",
                
              });
            } else {
              const id = result[0].id;
              const token = jwt.sign({ id: id }, process.env.JWT_SECRET, {
                expiresIn: process.env.JWT_EXPIRES_IN,
              });
             
              const cookieOptions = {
                expires: new Date(
                  Date.now() +
                    process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000
                ),
                httpOnly: true,
              };
              res.cookie("acces", token, cookieOptions);
              res.status(200).redirect("/profile-freelance");
            }
          }
        }
      );
    } catch (error) {
      console.log(error);
    }
  };