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
          db.query('SELECT * FROM utilisateurs where email = ? ', [email], (error, result) => {
            if (error) throw error;
            return res.render('complement', {
              utilisateurs: result[0]
            });
          });

        }
      }
    );
  });
};

exports.registerClient = async (req, res) => {
  const { nom, prenom, pseudo, email, mot_de_passe, confirm_mot_de_passe, date_nai } = req.body;
  const type = "client";
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
          db.query('SELECT * FROM utilisateurs where email = ? ', [email], (error, result) => {
            if (error) throw error;
            return res.render('complementClient', {
              utilisateurs: result[0]
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

exports.parametreClient = (req, res) => {


  const { id_utilisatuers, secteur, matricule } = req.body;
  const image_url = 'logoClient.jpg'

  const sql = "UPDATE utilisateurs SET image_url = ? WHERE id = ?";
  db.query(sql, [image_url, id_utilisatuers], (error, results) => {
    if (error) {
      console.log(error);
      return res.render('complementClient', {
        message: 'Erreur serveur, veuillez réessayer ultérieurement',
      });
    } else {
      db.query('INSERT INTO client SET ?', { id_utilisateurs: id_utilisatuers, secteur: secteur, matricule_fiscal: matricule }, (error, results) => {
        if (error) {
          console.log(error);
          return res.render('complementClient', {
            message: 'Erreur serveur, veuillez réessayer ultérieurement',
          });
        } else {
          return res.render('connexion');
        }
      });
    }
  });
}



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
              id_utilisateurs = result[0].id;
              db.query(
                "select * from freelance where id_utilisatuers=?",
                [result[0].id],
                (errors, results) => {
                  if (result.length > 0) {
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




            } else if (result[0].type_compte == "client") {

              req.session.userclient = result[0];
              id_utilisateurs = result[0].id;
              res.status(200).redirect("/dashboardClient");

            } else {

              db.query(
                "select * from utilisateurs where email=?",
                [email],
                (error, result) => {
                  if (result.length <= 0) {
                    return res.status(401).render("loginAdmin", {
                      message: "SVP Ecrire voutr Email et  Mot de passe",
          
                    });
                  }else {
                    if (mot_de_passe != result[0].mot_de_passe) {
                      return res.status(401).render("loginAdmin", {
                        message: "SVP Ecrire voutr Email et  Mot de passe",
          
                      });
                    }else if (result[0].type_compte == "admin") {

                      req.session.admin = result[0];
                      id_utilisateurs = result[0].id;
                      res.status(200).redirect("/admin/dashboard");
        
                    }
                  }
                })
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
      return res.render('param_freelance', {
        message: 'Erreur lors du téléchargement de l\'image',
      });
    }

    // Check if a file was uploaded
    if (!req.file) {
      const { id_utilisateurs, discription, categories, tags, nom, prenom,date_nai } = req.body;
      const tagsArray = tags.split(',').map(tag => tag.replace(/[\[\]":{}]|\bvalue\b/g, '').trim());

      const sql = "UPDATE utilisateurs SET  nom = ?, prenom = ?, date_nai = ? WHERE id = ?";
      db.query(sql, [nom, prenom, date_nai, id_utilisateurs], (error, results) => {
        if (error) {
          console.error('Erreur lors de la mise à jour des données utilisateurs', error);
          return res.render('param_freelance', {
            message: 'Erreur serveur, veuillez réessayer ultérieurement',
          });
        }

        const updateFreelanceQuery = 'UPDATE freelance SET discription = ?, categories = ? WHERE id_utilisatuers = ?';
        db.query(updateFreelanceQuery, [discription, categories, id_utilisateurs], (error, results) => {
          if (error) {
            console.error('Erreur lors de la mise à jour des données freelance', error);
            return res.render('param_freelance', {
              message: 'Erreur serveur, veuillez réessayer ultérieurement',
            });
          }

          const selectFreelanceQuery = 'SELECT * FROM freelance WHERE id_utilisatuers = ?';
          db.query(selectFreelanceQuery, [id_utilisateurs], (error, results) => {
            if (error) {
              console.error('Erreur lors de la récupération des données freelance', error);
              return res.render('param_freelance', {
                message: 'Erreur serveur, veuillez réessayer ultérieurement',
              });
            }

            const id_freelance = results[0].id;
            const values = tagsArray.map(tag => [id_freelance, tag]);

            const deleteCompetenceQuery = 'DELETE FROM competance  WHERE id_freelance = ?';
            db.query(deleteCompetenceQuery, [id_freelance], (error, results) => {
              if (error) {
                console.error('Erreur lors de la mise à jour des compétences', error);
                return res.render('param_freelance', {
                  message: 'Erreur serveur, veuillez réessayer ultérieurement',
                });
              } else {
                const insertCompetenceQuery = 'INSERT INTO competance (id_freelance, nom) VALUES ?';
                db.query(insertCompetenceQuery, [values], (error, results) => {
                  if (error) {
                    console.error('Erreur lors de la mise à jour des compétences', error);
                    return res.render('param_freelance', {
                      message: 'Erreur serveur, veuillez réessayer ultérieurement',
                    });
                  } else {
                    return res.status(200).redirect("/profile");
                  }
                });
              }
            });
          });
        });
      });
    } else {
      const image_url = req.file.filename;
      const { id_utilisateurs, discription, categories, tags, nom, prenom,date_nai } = req.body;
      const tagsArray = tags.split(',').map(tag => tag.replace(/[\[\]":{}]|\bvalue\b/g, '').trim());

      const sql = "UPDATE utilisateurs SET image_url = ?, nom = ?, prenom = ? date_nai = ? WHERE id = ?";
      db.query(sql, [image_url, nom, prenom, date_nai, id_utilisateurs], (error, results) => {
        if (error) {
          console.error('Erreur lors de la mise à jour des données utilisateurs', error);
          return res.render('complement', {
            message: 'Erreur serveur, veuillez réessayer ultérieurement',
          });
        }

        const updateFreelanceQuery = 'UPDATE freelance SET discription = ?, categories = ? WHERE id_utilisatuers = ?';
        db.query(updateFreelanceQuery, [discription, categories, id_utilisateurs], (error, results) => {
          if (error) {
            console.error('Erreur lors de la mise à jour des données freelance', error);
            return res.render('complement', {
              message: 'Erreur serveur, veuillez réessayer ultérieurement',
            });
          }

          const selectFreelanceQuery = 'SELECT * FROM freelance WHERE id_utilisatuers = ?';
          db.query(selectFreelanceQuery, [id_utilisateurs], (error, results) => {
            if (error) {
              console.error('Erreur lors de la récupération des données freelance', error);
              return res.render('complement', {
                message: 'Erreur serveur, veuillez réessayer ultérieurement',
              });
            }

            const id_freelance = results[0].id;
            const values = tagsArray.map(tag => [id_freelance, tag]);

            const deleteCompetenceQuery = 'DELETE FROM competance  WHERE id_freelance = ?';
            db.query(deleteCompetenceQuery, [id_freelance], (error, results) => {
              if (error) {
                console.error('Erreur lors de la mise à jour des compétences', error);
                return res.render('param_freelance', {
                  message: 'Erreur serveur, veuillez réessayer ultérieurement',
                });
              } else {
                const insertCompetenceQuery = 'INSERT INTO competance (id_freelance, nom) VALUES ?';
                db.query(insertCompetenceQuery, [values], (error, results) => {
                  if (error) {
                    console.error('Erreur lors de la mise à jour des compétences', error);
                    return res.render('param_freelance', {
                      message: 'Erreur serveur, veuillez réessayer ultérieurement',
                    });
                  } else {
                    return res.status(200).redirect("/profile");
                  }
                });
              }
            });
          });
        });
      });
    }
  });
};



exports.logout = async (req, res, next) => {
  req.session.destroy();


  res.status(200).redirect("/acceuil");
};