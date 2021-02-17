const express = require('express'); // bring express module
const router = express.Router();


//Login
router.get('/login',(req,res) => res.render('login')); 

//Register
router.get('/register',(req,res) => res.render('register')); 

module.exports = router;