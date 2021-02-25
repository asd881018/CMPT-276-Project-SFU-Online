const express = require("express");
const app = express();
const pool = require("./dbConfig");

app.use(express.json())//=> req.body

//ROUTES
//Get all channel
app.get("/channel", async (req, res) => {
    try {
        const allChennel = await pool.query("SELECT * FROM channel");
        res.json(allChennel.rows);
    } catch (err) {
        console.error(err.message);
    }
});

//Get all the members in channel
app.get("/channel/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const allMembers = await pool.query("SELECT name FROM users, user_channel WHERE user_channel.user_id = users.id AND user_channel.channel_id =$1",
            [id]);
        res.json(allMembers.rows);
    } catch (err) {
        console.error(err.message);
    }
});

//Create new channel
app.post("/channel", async (req, res) => {
    try {
        const { channel_name } = req.body;
        const createChannel = await pool.query("INSERT INTO channel (channel_name) VALUES ($1::varchar) ON CONFLICT (channel_name) DO NOTHING",
            [channel_name]);
        res.json(createChannel.rows[0]);
    } catch (err) {
        console.error(err.message)
    }
});

//Add new member to channel (Unfixed)
app.post("/channel/:id", async (req, res) => {
    try {
        const { channel_id } = req.body;
        const { user_id } = req.parmas.id;
        const addMember = pool.query("INSERT INTO user_channel (user_id, channel_id) VALUES ($1::integer, $2::integer)", [user_id, channel_id]);
    } catch (err) {
        console.error(err.message);
    }
});

//Delete a member in channel (Unfixed)
app.delete("/channel/:channel_id/:user_id", async (req, res) => {
    try {
        const { channel_id } = req.params.channel_id;
        const { user_id } = req.params.user_id;
        const deleteMember = pool.query("DELETE FROM user_channel WHERE user_id =$1 AND channel_id = $2 ", [user_id, channel_id]);
    } catch (err) {
        console.error(err.message);
    }
});

//Delete channel (Unfixed)
app.delete("/channel/:id", async (req, res) => {
    try {
        const { channel_id } = req.params;
        const deleteChannel = pool.query("DELETE FROM channel WHERE channel_id =$1", [channel_id]);
        res.json("Channel has been deleted");
    } catch (err) {
        console.error(err.message);
    }
});


app.listen(3000, () => {
    console.log("Server is listening on port 3000");
});

