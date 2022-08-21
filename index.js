const express = require("express");
const app = express();
const cors = require("cors");

app.use(express.json())
app.use(cors())

//ROUTES
app.use("/auth", require("./routes/auth"))
app.use("/deeds", require("./routes/deeds"))
app.use("/reviews", require("./routes/reviews"))
app.use("/deed/comments", require("./routes/comments"))

app.listen(5000, () => {
    console.log("Server is running")
})