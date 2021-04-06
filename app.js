const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const Comment = require("./models/comment")

mongoose.connect('mongodb://localhost/commentApp', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
    console.log("Database connected!")
});

const app = express();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true }));

app.get("/comments", async (req, res) => {
    const comments = await Comment.find({});
    res.render("index", { comments });
});

app.listen(3000, () => {
    console.log("Server on port 3000!");
});