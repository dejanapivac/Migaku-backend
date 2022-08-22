const router = require("express").Router()
const authorization = require("../middleware/authorization");
const pool = require("../db");

router.post("/add/:id", authorization, async(req, res) => {
    const comment_by_id = req.user
    const deed_id = req.params.id
    const {comment} = req.body
    try{
        await pool.query("INSERT INTO comments (comment_by_id, deed_id, comment) VALUES ($1, $2, $3)", [comment_by_id, deed_id, comment])
        res.json({success: "true"})
    }catch(err){
        console.error(err.message)
        res.status(500).send("Couldn't add new comment.")
    }
})

router.get("/get/:id", async (req, res) => {
    const deed_id = req.params.id
    try{
        const comments = await pool.query("SELECT users.name, users.profile_picture, users.id, comment FROM comments INNER JOIN deeds ON comments.deed_id = deeds.id INNER JOIN users ON comments.comment_by_id = users.id WHERE deed_id = $1",
            [deed_id])
        res.json(comments.rows)
    }catch(err){
        console.error(err.message)
        res.status(500).send("Couldn't fetch comments.")
    }
})


module.exports = router;