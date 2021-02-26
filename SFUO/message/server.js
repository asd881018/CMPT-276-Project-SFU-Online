

function toMessage(){

    
    const path = require('path');
    const http = require('http');
    const express = require('express');
    const socketio = require('socket.io');
    const formatMessage = require('./utils/messages');
    
    
     //postgres stuff
    const {pool} = require ('./utils/dbConfig');
    // app.use(express.urlencoded({extended: false}));



    const app = express();
    const server = http.createServer(app);
    const io = socketio(server);

    const botname = 'Notice';

    //setting public as static folder
    app.use(express.static(path.join(__dirname, 'public')));

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
            io.emit('message', formatMessage('USERNAME', msg));
            pool.query(
                `INSERT INTO messageschema.table1 (username, message)
                Values ($1, $2)`,['USERNAME', msg],
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
    const PORT = 5000 || process.env.PORT;

    server.listen(PORT, () => console.log('server is running on port: ' + PORT));
}
module.exports.toMessage = toMessage();
