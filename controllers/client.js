const mysql = require('mysql');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

var multer = require('multer');

const db = mysql.createConnection({
  host: process.env.DATABASE_HOST,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE,
});

exports.ajoutmission = (req, res, next) => {
  const { titre, description, prix, duree, domaine, id_user } = req.body;
  const currentDate = new Date().toISOString().slice(0, 16).replace('T', ' ');

  const statu = "en cour";
  db.query('select * from client where id_utilisateurs = ?',[id_user], (error, results) => {
    if (error) {
      console.log(error);
    }else{
     const id_client = results[0].id
      db.query('INSERT INTO projet SET ?',{ titre: titre, description: description, prix: prix, duree: duree, domaine: domaine, date_publier: currentDate, statut_projet	: statu, id_client:id_client },
      (error, result) => {
        if (error) {
          console.log(error);
        }else{
          res.status(200).redirect("/listMission");
        }
          
        
    
      });
      }

  });

};
exports.proposerMission = (req, res, next) => {
  const { titre, description, prix, duree, domaine, id_user, id_freelance  } = req.body;
  const currentDate = new Date().toISOString().slice(0, 16).replace('T', ' ');

  const statu = "en cour";
  db.query('select * from client where id_utilisateurs = ?',[id_user], (error, results) => {
    if (error) {
      console.log(error);
    }else{
     const id_client = results[0].id
      db.query('INSERT INTO projet_proposer SET ?',{ titre: titre, description: description, prix: prix, duree: duree, domaine: domaine, date_publier: currentDate, statut_projet	: statu, id_client:id_client , id_freelance:id_freelance},
      (error, result) => {
        if (error) {
          console.log(error);
        }else{
          res.status(200).redirect("/listMission");
        } 
      });
      }

  });

};
exports.modifiermission = (req, res, next) => {
  const { id_projet, titre, description, prix, duree, domaine, } = req.body;
  const sql = "UPDATE projet SET titre = ?, description = ?, prix = ?, duree = ?, domaine = ? WHERE id = ?";
  db.query(sql,[ titre, description, prix, duree, domaine, id_projet] ,
  (error, result) => {
    if (error) {
      console.log(error);
    }else{
      res.status(200).redirect("/listMission");
    }
      
    

  });
};

exports.paiment = (req, res) => {
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
      console.error('Erreur lors du téléchargement de paiment', error);
    }

    if (!req.file) {
           
        } else {
        const image_url = req.file.filename;
        const verification = "non verifier";
        const currentDate = new Date().toISOString().slice(0, 16).replace('T', ' ');
        const { id_projet,id_client,id_offer } = req.body;  
        db.query('INSERT INTO payement SET ?',{ id_projet: id_projet, id_client: id_client, id_offer: id_offer, image_url: image_url,date_paiment:currentDate, verification:verification}, (error, results) => {
          if (error) {
            throw error;
          } else {
             const statu = "accepter" ;
            db.query('Update offer SET statut_offer = ? where id = ? ',[statu,id_offer], (error, results) => {
              if (error) {
                throw error;
              } else {
                const statu = "accepter" ;
                db.query('Update projet SET statut_projet = ? where id = ? ',[statu,id_projet], (error, results) => {
                  if (error) {
                    throw error;
                  } else {
                    res.status(200).redirect("/missionEncour");
                  }
                });
              }
            });
          }
        });

    }
  });

};