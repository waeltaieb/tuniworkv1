const express = require('express');


const router = express.Router();

router.get('/',(req,res) => {
    res.render('home')
});
router.get('/acceuil',(req,res) => {
    res.render('home')
});



router.get('/profile-freelance',(req,res) => {
    res.render('profile-freelance')
});
router.get('/client',(req,res) => {
    res.render('client')
});



router.get('/contact',(req,res) => {
    res.render('contact')
});

module.exports = router;