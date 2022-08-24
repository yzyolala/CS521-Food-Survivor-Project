const express = require('express');
const exphbs = require('express-handlebars');
const configRoutes = require('./routes');
const session = require('express-session');

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const static = express.static(__dirname + '/public');
app.use('/public', static);
app.engine('handlebars', exphbs.engine({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');

app.use(session({
    name: 'AuthCookie',
    secret: 'some secret string!',
    resave: false,
    saveUninitialized: true
}));

async function authentication(req, res, next) {
    if (req.session.user) {
        console.log('Authentication User');
    } else {
        console.log('Non-Authenticated User')
    }
    next();
}

app.use(authentication);

app.use(async(req, res, next) => {
    const currentTimestamp = new Date().toUTCString();
    const requestMethod = req.method;
    const requestRoute = req.originalUrl;
    if (req.session.user) {
        console.log(
            `[${currentTimestamp}]: ${requestMethod} ${requestRoute} (Authenticated User)`)
    } else {
        console.log(
            `[${currentTimestamp}]: ${requestMethod} ${requestRoute} (Non-Authenticated User)`)
    }
    next();
})

app.use('/private', (req, res, next) => {
    if (!req.session.AuthCookie) {
        res.status(403);
        return res.render("users/message", { title: "Error", heading: "Error", message: "User is not logged in", msg: true });
    } else {
        next();
    }
});

configRoutes(app);
app.listen(3000, () => {
    console.log("We've got a server now");
    console.log("Your routes will be running on http://localhost:3000");
});