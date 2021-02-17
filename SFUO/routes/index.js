const express = require('express'); // bring express module
const router = express.Router();

router.get('/',(req,res) => res.render('home')); //redirects to home page

module.exports = router;