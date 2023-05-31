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


exports.ajoutOffer = (req, res) => {
  // Multer configuration
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
  const upload = multer({ storage: storage }).single('pdfFile');

  upload(req, res, (error) => {
    if (error) {
      console.error('Erreur lors du téléchargement de CV', error);
      return res.render('freedashbord', {
        message: 'Erreur lors du téléchargement de CV',
      });
    }

    if (!req.file) {
      const { id_projet, id_utilisateur, description, montant } = req.body;
      const currentDate = new Date().toISOString().slice(0, 16).replace('T', ' ');

      db.query('SELECT * FROM freelance WHERE id_utilisatuers  = ?', [id_utilisateur], (error, results) => {
        if (error) {
          throw error;
        } else {
          const id_freelance = results[0].id;
          db.query(
            'INSERT INTO offer SET ?',
            { id_freelance: id_freelance, id_projet: id_projet, description: description, prix: montant, date_offer: currentDate },
            (error, result) => {
              if (error) {
                console.log(error);

              } else {
                res.status(200).redirect("/dashboard");

              }
            }
          );
        }
      }) } else {
        const pdfFile = req.file.filename;
        const { id_projet, id_utilisateur, description, montant } = req.body;
        const currentDate = new Date().toISOString().slice(0, 16).replace('T', ' ');
  
        db.query('SELECT * FROM freelance WHERE id_utilisatuers  = ?', [id_utilisateur], (error, results) => {
          if (error) {
            throw error;
          } else {
            const id_freelance = results[0].id;
            db.query(
              'INSERT INTO offer SET ?',
              { id_freelance: id_freelance, id_projet: id_projet, description: description, prix: montant, date_offer: currentDate, cv_freelance:pdfFile },
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

    }
  });

};