const express = require("express");

const app = express();

const session = require("express-session");

const userRoute = require('./routes/userRoutes');

app.set("view engine", "ejs");

app.use(function (req, res, next) {
    console.log(req.method, req.url);
    next();
});

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use(session({
    secret: 'iamasecret',
    resave: true,
    saveUninitialized: true,
}));

app.use("/", userRoute);

app.listen(8000, function () {
    console.log("Server is running on port 8000");
});