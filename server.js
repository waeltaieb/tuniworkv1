const express = require("express");
const app = express();
const path = require('path');
const temp_path = path.join(__dirname, 'views');
const hbs = require('hbs');
const exphbs = require('express-handlebars');
const dotenv = require("dotenv"); 
const cookieParser = require("cookie-parser");

dotenv.config({ path:"./.env"});

app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser());
app.use(express.urlencoded({ extended: false}));
app.use(express.json());

 hbs.registerPartials(__dirname + '/views/partials');




const mysql      = require('mysql');
const db = mysql.createConnection({
  host     : process.env.DATABASE_HOST,
  user     : process.env.DATABASE_USER,
  password : process.env.DATABASE_PASSWORD,
  database : process.env.DATABASE,
});
 
db.connect((error) => {
    if(error){
        console.log(error)
    }else{
        console.log("db connecte")
    }
}

);

app.set('view engine', 'hbs');
app.set('views', temp_path);


//routes
app.use('/', require('./routes/pages'));
app.use('/', require('./routes/auth'));
app.use('/', require('./routes/posts'));


app.listen(3000);