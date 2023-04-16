const express = require("express");
const app = express();
const path = require('path');
const temp_path = path.join(__dirname, 'views');
const hbs = require('hbs');

app.set('view engine', 'hbs');
app.set('views', temp_path);
app.use(express.static(path.join(__dirname, 'public')));
hbs.registerPartials(__dirname + '/views/partials');
app.use("/images", express.static(path.join(__dirname, "/public/images")));
app.get('/',(req,res) => {
    res.render('home')
});
app.get('/acceuil',(req,res) => {
    res.render('home')
});

app.get('/inscription',(req,res) => {
    res.render('inscription')
});

app.get('/inscritfreelacnce',(req,res) => {
    res.render('inscritfreelance')
});

app.listen(3000);