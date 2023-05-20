const express = require('express');
const mysql = require('mysql');

const router = express.Router();
const db = mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE,
});


router.get('/post/:post_id', (req, res) => {
    const id = req.params.post_id;
    db.query('SELECT * FROM blogs WHERE id = ?', [id], function (error, results, fields) {

        if (error) throw error;

        res.render('post', {
            tab: results
        });

    });
});




router.get('/journal', (req, res) => {
    db.query('SELECT * FROM blogs ', function (error, results, fields) {

        if (error) throw error;

        res.render('journal', {

            tab: results
        });

    });
});

module.exports = router;