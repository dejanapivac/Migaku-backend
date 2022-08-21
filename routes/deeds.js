const router = require("express").Router()
const authorization = require("../middleware/authorization");

const pool = require("../db");

router.post("/add", authorization, async (req, res) => {
    const current_user_id = req.user;
    const {image, name, category, street, zipCode, city, country, start_time, description} = req.body;

    try {
        await pool.query("INSERT INTO deeds (creator_user_id, image, name, category, street, zipCode, city, country, start_time, description) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9,$10)",
            [current_user_id, image, name, category, street, zipCode, city, country, start_time, description]);

        res.json({success: "true"});
    } catch (err) {
        console.error(err.message)
        res.status(500).send("New deed save unsuccessful");
    }
})

router.get("/getNearbyDeeds", authorization, async (req, res) => {
    const user_id = req.user;
    try {
        const user = await pool.query("SELECT city, country from users WHERE id = $1", [user_id])
        const userCity = user.rows[0].city
        const userCountry = user.rows[0].country
        const nearbyDeeds = await pool.query("SELECT users.id as user_id, deeds.creator_user_id, image, deeds.name as  deedName, category, street, zipCode, deeds.city as deedCity, deeds.country as deedCountry, start_time, users.name as creatorUserName FROM deeds INNER JOIN users ON deeds.creator_user_id = users.id WHERE deeds.city = $1 AND deeds.country = $2 AND completed = false",
            [userCity, userCountry])

        res.json(nearbyDeeds.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Can't fetch nearby deeds");
    }
})

router.get("/searchedCity", authorization, async(req, res) => {
    const {searched_city} = req.body
    try{
        const eventsInSearchedCity = await pool.query("SELECT * FROM deeds WHERE city = $1", [searched_city])
        res.json(eventsInSearchedCity.rows);
    }catch(err){
        console.error(err.message)
        res.status(500).send("")
    }
})

//user is going on event
router.post("/attendEvent/:id", authorization, async (req, res) => {
    const user_id = req.user;
    const deed_id = req.params.id;

    try {
        const going = await pool.query("SELECT * FROM attendants WHERE user_id = $1 AND deed_id = $2", [user_id, deed_id])
        if (going.rows.length !== 0) {
            await pool.query("DELETE FROM attendants WHERE user_id = $1 AND deed_id = $2", [user_id, deed_id]);
            return res.json({success: "Deleted successfully"});
        }

        await pool.query("INSERT INTO attendants (user_id, deed_id) VALUES ($1, $2)", [user_id, deed_id]);
        res.json({success: "Added event attendant"});
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Unable to add attendee.")
    }
})

//all deeds user attended
router.get("/attended/:id", async(req, res) => {
    const user_id = req.params.id;
    try{
        const attended = await pool.query("SELECT users.id as user_id, image, deeds.name AS deedName, category, street, zipCode, deeds.city AS deedCity, deeds.country AS deedCountr, start_time, users.name, deeds.description FROM deeds INNER JOIN attendants ON deeds.id = attendants.deed_id INNER JOIN users ON deeds.creator_user_id = users.id WHERE attendants.user_id = $1", [user_id])
        res.json(attended.rows)
    }catch(err){
        console.error(err.message);
        res.status(500).send("Couldn't fetch attended deeds.")
    }
})

//events user created
router.get("/created/:id", async (req, res) => {
    const user_id = req.params.id;
    try{
        const created = await pool.query("SELECT users.id as user_id, image, deeds.name AS deedName, category, street, ZipCode, deeds.city AS deedCity, deeds.country AS deedCOuntry, start_time, users.name FROM deeds INNER JOIN users ON deeds.creator_user_id = users.id WHERE deeds.creator_user_id = $1", [user_id])
        res.json(created.rows)
    }catch (err){
        console.log(err.message);
        res.status(500).send("Couldn't fetch created deeds.")
    }
})

//event creator completes event
router.patch("/complete/:id", authorization, async (req, res) => {
    const user_id = req.user;
    const deed_id = req.params.id
    try{
        await pool.query("UPDATE deeds SET completed = true WHERE id = $1 AND deeds.creator_user_id = $2", [deed_id, user_id])
        res.json({success: "Deed completed."});
    }catch(err){
        console.log(err.message);
        res.status(500).send("Couldn't complete event.")
    }
})

router.get("/getAttendees/:id", async(req, res) => {
    const deed_id = req.params.id
    try{
        const attendees = await pool.query("SELECT users.profile_picture, users.name, users.id FROM users INNER JOIN attendants ON users.id = attendants.user_id WHERE attendants.deed_id = $1",
            [deed_id])
        res.json(attendees.rows)
    }catch(err){
        console.error(err.message)
        res.status(500).send("Couldn't fetch number of attendees.")
    }
})

router.get

module.exports = router;