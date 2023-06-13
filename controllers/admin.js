const mysql = require('mysql');


const db = mysql.createConnection({
  host: process.env.DATABASE_HOST,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE,
});



exports.cherchefreelancer = (req, res, next) => {
    const type = "freelance";
    
    const searchQuery = req.body.searchQuery;
  
    const query = 'SELECT * FROM utilisateurs WHERE type_compte = ? and ban = 0 AND (nom LIKE ? OR prenom LIKE ? OR email LIKE ?)';
    const params = [type, `%${searchQuery}%`, `%${searchQuery}%`, `%${searchQuery}%`];
  
    db.query(query, params, function (error, searchResults, fields) {
      if (error) throw error;
      res.render('/listefreelancer', {
        tab: searchResults,
        searchQuery: searchQuery,
        utilisateurs: req.session.admin,
      });
    });
  };

  exports.ban = (req, res, next) => {
    if (req.body.userId) {
        const userId = req.body.userId;
        const newBanValue = 1;
    
        const updateQuery = 'UPDATE utilisateurs SET ban = ? WHERE id = ?';
        const updateParams = [newBanValue, userId];
    
        db.query(updateQuery, updateParams, function (error, updateResult, fields) {
          if (error) throw error;
    
    
          res.redirect('/listefreelancer');
        });
      }
  };
  exports.banc = (req, res, next) => {
    if (req.body.userId) {
        const userId = req.body.userId;
        const newBanValue = 1;
  
        const updateQuery = 'UPDATE utilisateurs SET ban = ? WHERE id = ?';
        const updateParams = [newBanValue, userId];
  
        db.query(updateQuery, updateParams, function (error, updateResult, fields) {
          if (error) throw error;
  
  
          res.redirect('/listeclient');
        });
      }
  };
 
  exports.listeclientbloquer = (req, res, next) => {
    const searchQuery = req.body.searchQuery;
    const type = "client";
    const query = 'SELECT * FROM utilisateurs WHERE type_compte=? And ban = 1 AND (nom LIKE ? OR prenom LIKE ? OR email LIKE ?)';
    const params = [type,`%${searchQuery}%`, `%${searchQuery}%`, `%${searchQuery}%`];
  
    db.query(query, params, function (error, searchResults, fields) {
      if (error) throw error;
      res.render('listeclientbloquer', {
        tab: searchResults,
        searchQuery: searchQuery
      });
    });
  };
  exports.suprrimer = (req, res, next) => {
    if (req.body.userId) {
        const userId = req.body.userId;
        const type="client";
        const updateQuery = 'Delete from utilisateurs WHERE type_compte=? And id = ?';
        const updateParams = [type,userId];
  
        db.query(updateQuery, updateParams, function (error, updateResult, fields) {
          if (error) throw error;

  
          res.redirect('/listeclientbloquer');
        });
      }
  };
  exports.debloquer = (req, res, next) => {
    if (req.body.userId1) {
        const userId = req.body.userId1;
        const newBanValue = 0;
  
        const updateQuery = 'UPDATE utilisateurs SET ban = ? WHERE id = ?';
        const updateParams = [newBanValue, userId];
  
        db.query(updateQuery, updateParams, function (error, updateResult, fields) {
          if (error) throw error;
  
  
          res.redirect('/listeclientbloquer');
        });
      }
  };
   
  exports.suprrimer1 = (req, res, next) => {
    if (req.body.userId) {
        const userId = req.body.userId;
        const type="freelance";
        const updateQuery = 'Delete from utilisateurs WHERE type_compte=? And id = ?';
        const updateParams = [type,userId];
    
        db.query(updateQuery, updateParams, function (error, updateResult, fields) {
          if (error) throw error;
    
    
          res.redirect('/listefreelancerbloquer');
        });
      }
  };
  exports.debloquer1 = (req, res, next) => {
    if (req.body.userId1) {
        const userId = req.body.userId1;
        const newBanValue = 0;
    
        const updateQuery = 'UPDATE utilisateurs SET ban = ? WHERE id = ?';
        const updateParams = [newBanValue, userId];
    
        db.query(updateQuery, updateParams, function (error, updateResult, fields) {
          if (error) throw error;
    
    
          res.redirect('/listefreelancerbloquer');
        });
      }
  };
  exports.listeprojet = (req, res, next) => {
    const searchQuery = req.body.searchQuery || '';
    const query = `
    SELECT utilisateurs.nom, utilisateurs.image_url, utilisateurs.prenom  , projet.id , projet.titre  , projet.description  , projet.prix  , projet.duree, projet.date_publier 
    FROM utilisateurs 
    INNER JOIN client ON utilisateurs.id = client.id_utilisateurs INNER JOIN projet ON client.id = projet.id_client
      WHERE projet.titre LIKE ? OR utilisateurs.nom LIKE ? OR utilisateurs.prenom LIKE ?
    `;
    const params = [`%${searchQuery}%`, `%${searchQuery}%`, `%${searchQuery}%`];
  
    db.query(query, params, (error, results, fields) => {
      if (error) throw error;
  
      res.render('listeprojet', {
        utilisateurs: req.session.admin,
        projet: results,
        searchQuery: searchQuery
      });
    });
  };
 
 
  exports.supprimerprojet = (req, res, next) => {
    if (req.body.userId) {
        const userId = req.body.userId;
        
        const updateQuery = 'Delete from projet WHERE id = ?';
        const updateParams = [userId];
    
        db.query(updateQuery, updateParams, function (error, updateResult, fields) {
          if (error) throw error;
    
    
          res.redirect('/listeprojet');
        });
      }
  };
  exports.paiement = (req, res, next) => {
    const searchQuery = req.body.searchQuery || '';
    const type = "non verifier";
    const query = 'SELECT * from payement where verification= ? AND (id LIKE ?)';
    const params = [type, `%${searchQuery}%`];
  
    db.query(query, params, (error, results, fields) => {
      if (error) throw error;
  
      res.render('paiement', {
        utilisateurs: req.session.admin,
        Paiement: results,
        searchQuery: searchQuery
      });
    });
  };
  exports.accepter = (req, res, next) => {
    if (req.body.paiementid) {
        const paiementid = req.body.paiementid;
        const newValue = "verifier";
    
        const updateQuery = 'UPDATE payement SET verification = ? WHERE id = ?';
        const updateParams = [newValue, paiementid];
    
        db.query(updateQuery, updateParams, function (error, updateResult, fields) {
          if (error) throw error;
    
    
          res.redirect('/paiement');
        });
      }
  };
  exports.envoyeralert = (req, res, next) => {
    if (req.body.paiementid1) {
        const paiementid1 = req.body.paiementid1;
        const newValue = "votre paiement n'existe pas";
    
        const updateQuery = 'UPDATE payement SET alerte = ? WHERE id = ?';
        const updateParams = [newValue, paiementid1];
    
        db.query(updateQuery, updateParams, function (error, updateResult, fields) {
          if (error) throw error;
    
    
          res.redirect('/paiement');
        });
      }
  };