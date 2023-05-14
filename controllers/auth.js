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
exports.parametre = (req, res) => {
  const storage = multer.diskStorage({
    destination: function (request, file, callback) {
      callback(null, './public/uploads/');
    },
    filename: function (request, file, callback) {
      var temp_file_arr = file.originalname.split(".");
      var temp_file_name = temp_file_arr[0];
      var temp_file_extension = temp_file_arr[1];
      callback(null, temp_file_name + '-' + Date.now() + '.' + temp_file_extension);
    }
  });
   
  const upload = multer({ storage: storage }).single('image_url');

  upload(req, res, (error) => {
    if (error) {
      return res.render('complement', {
        message: 'Erreur lors du téléchargement de l\'image',
      });
    } else {
      const image_url = req.file.filename;
      const { id_utilisatuers, discription, categories, tags } = req.body;
      const tagsArray = tags.split(',').map(tag => tag.replace(/[\[\]":{}]|\bvalue\b/g, '').trim());


      const sql = "UPDATE utilisateurs SET image_url = ? WHERE id = ?";
      db.query(sql, [image_url, id_utilisatuers], (error, results) => {
        if (error) {
          console.log(error);
          return res.render('complement', {
            message: 'Erreur serveur, veuillez réessayer ultérieurement',
          });
        } else {
          db.query('INSERT INTO freelance SET ?', { id_utilisatuers: id_utilisatuers, discription: discription, categories: categories }, (error, results) => {
            if (error) {
              console.log(error);
              return res.render('complement', {
                message: 'Erreur serveur, veuillez réessayer ultérieurement',
              });
            } else {
              db.query('SELECT * FROM freelance WHERE id_utilisatuers = ?', [id_utilisatuers], (error, results) => {
                if (error) {
                  console.log(error);
                  return res.render('complement', {
                    message: 'Erreur serveur, veuillez réessayer ultérieurement',
                  });
                } else {
                  const id_freelance = results[0].id;
                  const values = tagsArray.map(tag => [id_freelance, tag]);

                  db.query('INSERT INTO competance (id_freelance, nom) VALUES ?', [values], (error, results) => {
                    if (error) {
                      console.log(error);
                      return res.render('complement', {
                        message: 'Erreur serveur, veuillez réessayer ultérieurement',
                      });
                    } else {
                      return res.render('connexion');
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
};



exports.login = (req, res, next) => {
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
      (error, result) => {

        if (result.length <= 0) {
          return res.status(401).render("connexion", {
            message: "SVP Ecrire voutr Email et  Mot de passe",

          });
        } else {
          if (!(bcrypt.compare(mot_de_passe, result[0].mot_de_passe))) {
            return res.status(401).render("connexion", {
              message: "SVP Ecrire voutr Email et  Mot de passe",

            });
          } else {
            if (result[0].type_compte == "freelance") {
              req.session.user = result[0];
              db.query(
                "select * from freelance where id_utilisatuers=?",
                [result[0].id],
                (errors, results) => {
                  if(result.length > 0){
                    freelance = results[0];
                    db.query(
                      "select * from competance where id_freelance=?",
                      [results[0].id],
                      (err, reslt) => {
                        comptance = reslt;
                        
                        res.status(200).redirect("/dashboard");
                      }
                    );
                  }
                  
                  
                }
              );
              

              
              
            } else {

            }


          }
        }
      }
    );
  } catch (error) {
    console.log(error);
  }
};
exports.modifier = (req, res, next) => {
  const storage = multer.diskStorage({
    destination: function (request, file, callback) {
      callback(null, './public/uploads/');
    },
    filename: function (request, file, callback) {
      var temp_file_arr = file.originalname.split(".");
      var temp_file_name = temp_file_arr[0];
      var temp_file_extension = temp_file_arr[1];
      callback(null, temp_file_name + '-' + Date.now() + '.' + temp_file_extension);
    }
  });

  const upload = multer({ storage: storage }).single('image_url');
  upload(req, res, (error) => {
    if (error) {
      console.error('Erreur lors du téléchargement de l\'image', error);
      return res.render('complement', {
        message: 'Erreur lors du téléchargement de l\'image',
      });
    }

    const image_url = req.file.filename;
    const { id_utilisateurs, discription, categories, tags, nom, prenom } = req.body;
    const tagsArray = tags.split(',').map(tag => tag.replace(/[\[\]":{}]|\bvalue\b/g, '').trim());

    const sql = "UPDATE utilisateurs SET image_url = ?, nom = ?, prenom = ? WHERE id = ?";
    db.query(sql, [image_url, nom, prenom, id_utilisateurs], (error, results) => {
      if (error) {
        console.error('Erreur lors de la mise à jour des données utilisateurs', error);
        return res.render('complement', {
          message: 'Erreur serveur, veuillez réessayer ultérieurement',
        });
      }

      db.query('UPDATE freelance SET discription = ?, categories = ? WHERE id_utilisateurs = ?', [discription, categories, id_utilisateurs], (error, results) => {
        if (error) {
          console.error('Erreur lors de la mise à jour des données freelance', error);
          return res.render('complement', {
            message: 'Erreur serveur, veuillez réessayer ultérieurement',
          });
        }

        db.query('SELECT * FROM freelance WHERE id_utilisateurs = ?', [id_utilisateurs], (error, results) => {
          if (error) {
            console.error('Erreur lors de la récupération des données freelance', error);
            return res.render('complement', {
              message: 'Erreur serveur, veuillez réessayer ultérieurement',
            });
          }

          const id_freelance = results[0].id;
          const values = tagsArray.map(tag => [tag]);

          db.query('UPDATE competance SET nom = ? WHERE id_freelance = ?', [values, id_freelance], (error, results) => {
            if (error) {
              console.error('Erreur lors de la mise à jour des compétences', error);
              return res.render('complement', {
                message: 'Erreur serveur, veuillez réessayer ultérieurement',
              });
            }

            return res.status(200).redirect("/profile");
          });
        });
      });
    });
  });
};


/* exports.isLoggedIn = async (req, res, next) => {

   if (req.cookies.acces) {
     try {
       const decode = await promisify(jwt.verify)(
         req.cookies.acces,
         process.env.JWT_SECRET
       );

       db.query(
         "select * from utilisateurs where id=?",
         [decode.id],
         (err, results) => {

           if (!results) {
             return next();
           }
           req.utilisateurs = results[0];
           return next();
         }
       );
     } catch (error) {
       console.log(error);
       return next();
     }
   } else {
     next();
   }
 };*/

exports.logout = async (req, res, next) => {
  req.session.destroy();


  res.status(200).redirect("/acceuil");
};