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


// group loading
app.use(express.static(__dirname + '/views'));



/*****************************************************MESSAGES********************************************************/
var username = "ERROR";
function updateUsername(temp){
	username = temp;
}
module.exports.updateUsername = updateUsername;

 app.use(express.static(__dirname + './views/main.js'));
app.use(express.static(__dirname + './views/css/stylemessage.css'));

const path = require('path');
const http = require('http');
const socketio = require('socket.io');
const formatMessage = require('./messages')   

//postgres stuff
// const {messagepool} = require ('./message/utils/dbConfig');

const server = http.createServer(app);
const io = socketio(server);
const botname = 'Notice';

//run when connection
io.on('connection', socket => {
	
	socket.on('joinRoom', ({username, room}) => {
		console.log("New Connection");
		//emits to single connecting user
		socket.emit('message', formatMessage(botname, 'Welcome to SFUO messaging'));

		//broadcast to everyone except the connecting user
		socket.broadcast.emit('message', formatMessage(botname, 'Someone connected'));
	});


	//listening for chatMessage
	socket.on('chatMessage', (msg) =>{
		io.emit('message', formatMessage(username, msg));
		var time = formatMessage(username, msg).time;
		pool.query(
			`INSERT INTO allmessages (sender, receiver, message, time)
			Values ($1, $2, $3, $4)`,[username, username, msg, time],
			(err, results) =>{
				if(err){console.log(err)}
				// console.log(results.rows);
			}
		)
	});

	socket.on('disconnect', () => {
		//emit to all users
		io.emit('message', formatMessage(botname, 'Someone disconnected'));
	});

});
/********************************************Video**********************************************************/


const {v4: uuidv4 } = require('uuid'); // import a certain version of uuid (v4), set and import uuid
const { ExpressPeerServer } = require('peer'); // import peer
const peerServer = ExpressPeerServer(server, { // using peer with express to get functionality

  debug: true
}); 

app.use(express.static('public')); //accesses public folder


// url to access peerserver
app.use('/peerjs', peerServer);// in room.ejs pasted this <script src="https://unpkg.com/peerjs@1.3.1/dist/peerjs.min.js"></script>

app.get('/room', (req, res) =>{
	res.redirect(`/${uuidv4()}`); // this line will automatically generate a uuid and redirect you to uuid link
})

// the root url takes you to page where it renders the room.ejs file
app.get('/:room', (req, res) =>{ // /:room is a parameter
	res.render('room', {roomId: req.params.room }) // roomID: is the uuid of the room
}) 

// connect to socket io
io.on('connection', socket => {
	socket.on('join-room',(roomId,userId)=>{ // sends message of joined room, then link it to a roomid to join room
		socket.join(roomId);// pass in roomID into socket.join to make it join room
		socket.to(roomId).broadcast.emit('user-connected', userId);// tells that we have a user connected and tells system we have a userID
		socket.on('message', message =>{ // will recieve the message, (function with message params)
			io.to(roomId).emit('createMessage', message); // send this message to the joined room, emit a message -> (in script.js under // receive msg)
		}) 

	})
})




/***********************************************************************************************************/

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

/*******************************************Dashboard*************************************************/

app.post("/users/dashboard",(req,res)=>{
	let {firstname, lastname, username, biography, year, courses}=req.body;
	console.log({
		firstname,
		lastname,
		username,
		biography,
		year,
		courses,
	});
	let errors=[];

	if(!firstname || !lastname || !username || !biography ||!year ||!courses){
		errors.push({message: "Please enter all fields!"});
	}

	if(username.length < 5){
		errors.push({message: "Password should be at least 5 chacters long!"});
	}


	if (errors.length > 0){
		res.render('dashboard', {errors});
	}
	
	pool.query (
		`INSERT INTO users (firstname, lastname, username, biography, year, courses)
		VALUES ($1, $2, $3, $4, $5, $6)`,[firstname,lastname,username, biography, year, courses]
	)


});





app.post('/users/login', passport.authenticate('local',{
	successRedirect: '/users/dashboard',
	failureRedirect: '/users/login',
	failureFlash: true
}));




const PORT = process.env.PORT || 8000;

// app.listen(PORT,console.log('Server started on port ${PORT}'));
server.listen(PORT, console.log(`server running on port ${PORT}`));