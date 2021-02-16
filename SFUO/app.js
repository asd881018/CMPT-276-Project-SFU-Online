const express = require('express');
const app = express();
const expressLayouts = require('express-ejs-layouts');


//EJS
app.use(expressLayouts);
app.set('view engine', 'ejs');

//Routes
app.use('/',require('./routes/index')); // must use this in tandem with router.get in index.js

app.use('/users', require('./routes/users')); // to go to this link, go to users/login, users/register

const PORT = process.env.PORT || 8000;

app.listen(PORT,console.log('Server started on port ${PORT}'));