const express = require('express'); // bring express module
const router = express.Router();
const {v4: uuidv4 } = require('uuid'); // import a certain version of uuid (v4), set and import uuid

//Login
router.get('/login', checkAuthenticated, (req,res) => res.render('login')); // renders login page

//Register
router.get('/register', checkAuthenticated, (req,res) => res.render('register')); // renders register page

router.get('/dashboard', checkNotAuthenticated, (req,res) => res.render('dashboard',{user: req.user.name })); // renders dashboard/account
// if we need to bypass to dashboard, comment out checkNotAuthenticated

//messagebox, redirects you to message system **************************************************
router.get('/message', (req, res) => res.render('index', {user: req.user.name}));
router.get('/message/chat',(req,res) => res.render('chat', {user: req.user.name})); //redirects to chat

//group
router.get('/channel', (req, res) => res.render('channel'));

// clicking on channel page redirects you to a group page with desired name
router.get('/channel_page', (req, res) => res.render('channel_page'));


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