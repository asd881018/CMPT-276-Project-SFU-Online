
    const express = require("express");
    const app = express();
    const pool = require("./db");
    const distanceInWords = require("date-fns/formatDistanceToNow");
    const router = express.Router();
    const expressLayouts = require('express-ejs-layouts');

    app.use(express.json())//=> req.body
    app.set("view engine", "ejs");
    app.use(express.static(__dirname + '/views'));


    //Routes
    app.use('/',require('./routes/index'));
    app.use('/users', require('./routes/users'));


    app.get('/', (req, res) => {
        res.render('channel')
    })


    //Create new channel
     app.post("/", async (req, res) => {
        try {
            const { channel_name } = req.body;
            const createChannel = await pool.query("INSERT INTO channel (channel_name) VALUES ($1::varchar) ON CONFLICT (channel_name) DO NOTHING",
                [channel_name]);
            res.json(createChannel.rows[0]);
        } catch (err) {
            console.error(err.message)
        }
    });


    //ROUTES
    //Get all channel
    app.get("/channel", async (req, res) => {
        try {
            const allChennel = await pool.query("SELECT * FROM channel");
            res.json(allChennel.rows);
            const rows = allChennel.rows
            res.send(JSON.stringify(rows))
        } catch (err) {
            console.error(err.message);
        }
    });

    //Store dicussion board's message to database
    app.post("/users/channel_page/:channel_name", async (req, res) => {
        const { channel_name } = req.params;
        const { sender } = req.body;
        const { message } = req.body;

        try {
            const newMessage = await pool.query("INSERT INTO discussion_board (channel_name, sender, message) VALUES ($1::VARCHAR,$2::VARCHAR, $3::VARCHAR)",
                [channel_name, sender, message]);
        } catch (err) {
            console.error(err.message);
        }
    })



    //Get message from database with specific channel_name
    app.get("/:channel_name", async (req, res) => {
        const { channel_name } = req.params;
        try {
            const allMessage = await pool.query("SELECT * FROM discussion_board WHERE channel_name = $1", [channel_name]);
            res.json(allMessage.rows);
            const rows = allMessage.rows
            res.send(JSON.stringify(rows))
        } catch (err) {
            console.error(err.message);
        }
    });




    app.listen(3000, () => {
        console.log("Server is listening on port 3000");
    });
