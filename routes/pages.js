const express = require('express');


const router = express.Router();

router.get('/',(req,res) => {
    res.render('home')
});
router.get('/acceuil',(req,res) => {
    res.render('home')
});

router.get('/inscription',(req,res) => {
    res.render('inscription')
});

router.get('/register',(req,res) => {
    res.render('register')
});
router.get('/connexion',(req,res) => {
    res.render('connexion')
});

module.exports = router;