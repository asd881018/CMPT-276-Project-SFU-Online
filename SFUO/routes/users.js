const express = require('express'); // bring express module
const router = express.Router();

//Login
router.get('/login', checkAuthenticated, (req,res) => res.render('login')); // renders login page

//Register
router.get('/register', checkAuthenticated, (req,res) => res.render('register')); // renders register page

router.get('/dashboard', checkNotAuthenticated, (req,res) => res.render('dashboard',{user: req.user.name })); // renders dashboard/account
// if we need to bypass to dashboard, comment out checkNotAuthenticated

//messagebox
router.get('/messagebox', (req, res) => res.render('messagebox'));

router.get('/logout',(req,res)=>{ // renders login page after logging out
	req.logout();
	req.flash('success_msg', "You have logged out");
	res.redirect('/users/login');

});

function checkAuthenticated(req, res, next){
	if(req.isAuthenticated()){
		return res.redirect('/users/dashboard');
	}
	next();
}

function checkNotAuthenticated(req, res, next){
	if(req.isAuthenticated()){
		return next();
	}

	res.redirect('/users/login');
}


module.exports = router;