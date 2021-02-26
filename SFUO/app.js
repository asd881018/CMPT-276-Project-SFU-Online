const express = require('express');
const app = express();
const expressLayouts = require('express-ejs-layouts');

//Postgres setup
const { pool } = require('./dbConfig');
//bcrypt
const bcrypt = require('bcrypt');
//session
const session = require('express-session');
//flash
const flash = require('express-flash');
//passport
const passport = require('passport');
const initializePassport = require('./passportConfig');
initializePassport(passport);


// function to load toMessage which launches the server.js file 
function temp() {
	const message = require("./message/server.js");
	message.toMessage;
}


//EJS
app.use(expressLayouts);
app.set('view engine', 'ejs');
app.use(express.urlencoded({extended: false}));

// session and flash messages
app.use(
	session({
	secret: 'secret',

	resave: false,

	saveUninitialized: false
	})
);


app.use(passport.initialize());
app.use(passport.session());
app.use(flash());



//Routes
app.use('/',require('./routes/index')); // must use this in tandem with router.get in index.js

app.use('/users', require('./routes/users')); // to go to this link, go to users/login, users/register


// register page login
app.post('/users/register', async (req, res) =>{
	let{name, email, password, password2 } = req.body;
	console.log({
		name,
		email,
		password,
		password2
	});
	let errors = [];
	if(!name || !email || !password || !password2){ // check if they filled all the fields
		errors.push({message: "Please enter all fields"});
	}

	if(password.length <6){ //length of passwords
		errors.push({message: "Password should at least be 6 characters"});
	}

	if(password != password2){
		errors.push({message: "Passwords do not match"});
	}

	if(errors.length > 0){
		res.render('register',{errors}); // if there is an error, rerender register page and show errors
	}else{
		//Form validation has passed, hashing password using bcyrpt

		let hashedPassword = await bcrypt.hash(password, 10); 
		console.log(hashedPassword);

		pool.query(
			`SELECT * FROM users WHERE email = $1 `,
			[email],
			(err, results)=>{
				if(err){
					throw err;
				}
				console.log(results.rows); //uses data from postgres

				if(results.rows.length > 0){
					errors.push({message: "Email already registered"}); // condition if user enters same fields twice in register page
					res.render('register', {errors});
				}else{
					pool.query(
						`INSERT INTO users (name, email, password)
						Values ($1, $2, $3)
						RETURNING id, password`,[name, email, hashedPassword],
						(err,results)=>{
							if(err){
								throw err;
							}
							console.log(results.rows);
							req.flash('success_msg',"You are now registered. Please log in"); // once registered
							res.redirect("/users/login"); // redirect to login page 
						}
					);
				}
			}
		);
	} 
});


app.post('/users/login', passport.authenticate('local',{
	successRedirect: '/users/dashboard',
	failureRedirect: '/users/login',
	failureFlash: true
}));




const PORT = process.env.PORT || 8000;

app.listen(PORT,console.log('Server started on port ${PORT}'));

module.exports.temp = temp();