const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const Comment = require("./models/comment");
const methodOverride = require("method-override");

mongoose.connect('mongodb://localhost/commentApp', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false
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
app.use(express.static("public"));
app.use(methodOverride("_method"));

app.get("/comments", (req, res) => {
    res.render("home")
});

app.get("/comments/index", async (req, res) => {
    const comments = await Comment.find({});
    res.render("index", { comments });
});

app.get("/comments/new", (req, res) => {
    res.render("new")
});

app.post("/comments", async (req, res) => {
    const comment = new Comment(req.body);
    await comment.save();
    res.redirect("/comments/index");
});

app.delete("/comments/:id/delete", async (req, res) => {
    const { id } = req.params;
    await Comment.findByIdAndDelete(id);
    res.redirect("/comments/index");
});

app.get("/comments/:id/edit", async (req, res) => {
    const { id } = req.params;
    const comment = await Comment.findById(id);
    res.render("edit", { comment });
});

app.put("/comments/:id/edit", async (req, res) => {
    const text = req.body;
    const { id } = req.params;
    await Comment.findByIdAndUpdate(id, text);
    res.redirect("/comments/index");
});

app.listen(3000, () => {
    console.log("Server on port 3000!");
});