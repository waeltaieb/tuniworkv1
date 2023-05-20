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