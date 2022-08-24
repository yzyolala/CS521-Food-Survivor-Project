const express = require('express');
const router = express.Router();
const users = require('../data/customers');
const mongoCollections = require('../config/mongoCollections');
const users1 = mongoCollections.customers;
const customers = mongoCollections.customers;
let { ObjectId } = require('mongodb');
const xss = require('xss');
const reviewsData = require('../data/reviews');
const salData = require('../data/restaurants')

const bcrypt = require('bcrypt');
const saltRounds = 7;
const multer = require('multer');
const path = require('path');

var fs = require('fs');
// SET STORAGE
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads')
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now())
    }
})

var upload = multer({ storage: storage })

router.post('/upload/profilepic', upload.single('picture'), async (req, res) => {
    var img = fs.readFileSync(req.file.path);
    var encode_image = img.toString('base64');
    let userId = req.session.user.id;
    var finalImg = {
        contentType: req.file.mimetype,
        image: Buffer.from(encode_image, 'base64')
    };

    const addingProfilePicture = await users.addUserProfilePicture(userId, finalImg);
    console.log("")
    console.log(addingProfilePicture);
    res.redirect("/private");
});

router.get('/profilepic/:id', async (req, res) => {
    const getUser = await users.getCustomerById(req.params.id);
    console.log(getUser)
    const profilepicData = getUser.profilePicture;
    if (profilepicData == "") {
        return res.status(400).send({
            message: 'No Profile Pic Found!'
        })
    } else {
        res.contentType('image/jpeg');
        res.send(profilepicData.image.buffer);
    }
});


router.get("/signup", (req, res) => {
    if (!req.session.AuthCookie)
        res.render("users/signup", { title: "Signup", heading: "Signup" });
    else
        res.redirect("/private");
});

router.get("/login", (req, res) => {
    if (!req.session.AuthCookie)
        res.render("users/login", { title: "Signup", heading: "Signup" });
    else
        res.redirect("/private");
});
router.get("/update", (req, res) => {
    if (!req.session.AuthCookie)
        res.render("users/login", { title: "Signup", heading: "Signup" });
    else
        res.render('users/private', {
            username: req.session.newcustomer.username,
            firstname: req.session.newcustomer.firstname,
            lastname: req.session.newcustomer.lastname,
            age: req.session.newcustomer.age,
            email: req.session.newcustomer.email,
            password: req.session.newcustomer.password,
            profilePicture: req.session.newcustomer.profilePicture,
        });
});


router.get('/delete', async (req, res) => {
    if (!req.session.AuthCookie) {
        res.render("users/signup", { title: "Signup", heading: "Signup" });
    } else {
        let errorcode = false;
        let tempId = req.session.user.id
        tempId = tempId.toString(tempId);
        console.log(tempId, "00000000000000000")
        try {
            deleteuser = await users.deleteCustomerbyId(tempId);
            if (deleteuser) {
                errorcode = true;
                res.status(500);
                return res.render("users/signup", { title: "Signup", heading: "Signup", errorcode: errorcode, message: "Your account has been delete successfully,Please create  an account again." });

            } else {
                return res.render("users/private", { title: "Signup", heading: "Signup", errorcode: errorcode, message: "User not deleted" });
            }
        } catch (e) {
            return res.render("users/private", { errorcode: errorcode, message: "User not deleted" });
        }
    }
});


router.get("/", (req, res) => {
    console.log('dsaf')
    if (!req.session.AuthCookie)
        res.render("users/login", { title: "Login", heading: "Login" });
    else
        res.redirect("/private");
});

router.post("/login", async (req, res) => {
    console.log(req.body);
    let errorcode = false;
    const errors = [];
    if (!req.body.username) {
        errorcode = true;
        res.status(400);
        return res.render("users/login", { errorcode: errorcode, errors: errors, message: "Please provide a username" });
    }

    if (!req.body.password) {
        errorcode = true;
        res.status(400);
        return res.render("users/login", { errorcode: errorcode, errors: errors, message: "Please provide a password" });
    }
    if (req.body.username.length == 0) {
        errorcode = true;
        res.status(400);
        return res.render("users/login", { errorcode: errorcode, message: "Username cannot be null or empty" });
    }

    if (typeof req.body.username != 'string') {
        errorcode = true;
        res.status(400);
        return res.render("users/login", { errorcode: errorcode, message: "Please enter username of type string" });
    }

    var regex = /^[a-zA-Z0-9.\-]{4,30}$/;
    if (!req.body.username.match(regex)) {
        errorcode = true;
        res.status(400);
        return res.render("users/login", { errorcode: errorcode, message: "Only Alphanumeric username is allowed and username should be more than 4 characters " });
    }

    if (req.body.password.length == 0) {
        errorcode = true;
        res.status(400);
        return res.render("users/login", { errorcode: errorcode, message: "Password cannot be null or empty" });
    }

    if (typeof req.body.password != 'string') {
        errorcode = true;
        res.status(400);
        return res.render("users/login", { errorcode: errorcode, errors: errors, message: "The entered password must be string only" });
    }
    var len;
    for (var i = 0, len = req.body.password.length; i < len; ++i) {
        if (req.body.password.charAt(i) === ' ') {
            errorcode = true;
            res.status(400);
            return res.render("users/login", { errorcode: errorcode, errors: errors, message: "Username cannot have spaces!" });
        }
    }
    if (req.body.password.length < 6) {
        errorcode = true;
        res.status(400);
        return res.render("users/login", { errorcode: errorcode, message: "Password should be greater than 6 characters" });
    }
    if (req.body.username.trim().length == 0) {
        errorcode = true;
        res.status(400);
        return res.render("users/login", { errorcode: errorcode, errors: errors, message: "Username cannot be only spaces" });
    }
    if (req.body.password.trim().length == 0) {
        errorcode = true;
        res.status(400);
        return res.render("users/login", { errorcode: errorcode, errors: errors, message: "Password cannot be only spaces" });
    }

    userData = req.body;
    userData.username = xss(userData.username);
    userData.password = xss(userData.password);
    console.log("userData", userData)
    try {
        console.log(userData.username, userData.password)
        const user = await users.checkUser(userData.username, userData.password);
        if (user) {
            req.session.AuthCookie = userData.username;
            console.log("req.session.AuthCookie", req.session.AuthCookie)
            console.log("userdata******", userData);
            req.session.user = { Username: userData.username, Password: userData.password };
            req.session.credentials = { Username: userData.username, Password: userData.password };
            console.log(req.session.user.Username, "=================")
            const customerCollection = await customers();
            customer_name = req.session.user.Username;
            console.log(customer_name, "-----customername----------")

            const customer_details = await customerCollection.findOne({ username: req.session.user.Username });
            console.log("*********", customer_details)
            console.log("*********", customer_details._id)
            userid = customer_details._id
            session_user_id = userid.toString()

            const testid = customer_details._id
            req.session.user = { id: testid }

            console.log(req.session.user, "req.session.user")
            req.session.customer = { age: customer_details.age, email: customer_details.email, email: customer_details.email, firstname: customer_details.firstname, lastname: customer_details.lastname, username: customer_details.username, password: customer_details.password };

            console.log("............", req.session.customer)
            console.log("req session 733333333333333333337333333333333333333", req.session.user)
            console.log(req.session.user, "req.session.user")

            const getReviews = await reviewsData.getReviewsPerCustomer(req.session.user.id);
            console.log(getReviews, 'getReviews************')

            res.status(200).render("users/private", { age: customer_details.age, email: customer_details.email, email: customer_details.email, firstname: customer_details.firstname, lastname: customer_details.lastname, username: customer_details.username, password: customer_details.password, getReviews: getReviews, title: "Login", heading: "Login" });
        } else {
            errorcode = true;
            res.status(400);
            return res.render("users/login", { errorcode: errorcode, error: "Either the username or password is invalid", title: "Login", heading: "Login", message: "Either the username or password is invalid" });
        }
    } catch (error) {
        errorcode = true;
        res.status(400);
        return res.render("users/login", { errorcode: errorcode, error: "Either the username or password is invalid", title: "Login", heading: "Login", message: "Either the username or password is invalid" });
    }

});

// Update users
router.post("/update", async (req, res) => {
    let errorcode = false;
    let editedUser;
    let hashedPassword;
    const user_info = req.body;
    console.log(req.body)
    const firstname = xss(user_info.firstname);
    const lastname = xss(user_info.lastname);
    const email = xss(user_info.email);
    const username = req.session.customer.username;
    const age = xss(user_info.age);
    const password = xss(user_info.password);
    const profilePicture = xss(user_info.profilePicture);
    if (password) {
        let plainTextPassword = password;
        const hash = await bcrypt.hash(plainTextPassword, saltRounds);
        hashedPassword = hash;
        editedUser = {
            hashedPassword: hashedPassword,
            firstname: firstname,
            lastname: lastname,
            username: username,
            email: email,
            password: password,
            age: age,
            profilePicture: profilePicture
        }
        req.session.newcustomer = { age: editedUser.age, email: editedUser.email, email: editedUser.email, firstname: editedUser.firstname, lastname: editedUser.lastname, username: editedUser.username, profilePicture: editedUser.profilePicture };
    } else {
        editedUser = {
            firstname: firstname,
            lastname: lastname,
            username: username,
            email: email,
            password: password,
            age: age
        }
        req.session.newcustomer = { age: editedUser.age, email: editedUser.email, email: editedUser.email, firstname: editedUser.firstname, lastname: editedUser.lastname, username: editedUser.username, password: editedUser.password, profilePicture: editedUser.profilePicture };
    }

    try {
        const updatedUser = await users.updateUser(req.session.user.id, editedUser);
        return res.render('users/private', {
            id: req.session.user.id,
            firstname: updatedUser.firstname,
            lastname: updatedUser.lastname,
            username: username,
            email: updatedUser.email,
            password: updatedUser.password,
            profilePicture: updatedUser.profilePicture,
            age: updatedUser.age,
            isUpdated: true,
        })
    } catch (e) {
        errorcode = true;
        res.status(404).render("users/private", { errorcode: errorcode, message: "Could not update user!" });
    }
});


router.post("/signup", async (req, res) => {
    console.log(req.body);
    let errorcode = false;
    const errors = [];
    if (!req.body.firstname) {
        errorcode = true;
        res.status(400);
        return res.render("users/signup", { errorcode: errorcode, errors: errors, message: "First name is not supplied" });
    }
    if (!req.body.lastname) {
        errorcode = true;
        res.status(400);
        return res.render("users/signup", { errorcode: errorcode, errors: errors, message: "Lastname is not supplied" });
    }
    if (!req.body.email) {
        errorcode = true;
        res.status(400);
        return res.render("users/signup", { errorcode: errorcode, errors: errors, message: "Email is not supplied" });
    }
    if (!req.body.age) {
        errorcode = true;
        res.status(400);
        return res.render("users/signup", { errorcode: errorcode, errors: errors, message: "Age is not supplied" });
    }
    if (!req.body.username) {
        errorcode = true;
        res.status(400);
        return res.render("users/signup", { errorcode: errorcode, errors: errors, message: "Username is not supplied" });
    }
    if (!req.body.password) {
        errorcode = true;
        res.status(400);
        return res.render("users/signup", { errorcode: errorcode, errors: errors, message: "Password is not supplied" });
    }
    if (req.body.username.length == 0) {
        errorcode = true;
        res.status(400);
        res.render('users/signup', { errorcode: errorcode, errors: errors, message: "Username cannot be null or empty" });
    }

    if (typeof req.body.username != 'string') {
        errorcode = true;
        res.status(400);
        res.render('users/signup', { errorcode: errorcode, message: "Username must be string" });
    }
    var regex = /^[a-zA-Z0-9.\-]{4,30}$/;
    if (!req.body.username.match(regex)) {
        errorcode = true;
        res.status(400);
        res.render('users/signup', { errorcode: errorcode, errors: errors, errorcode: true, message: "Enter username which contains alphanumeric values, without spaces and should be greater than 4" });
    }
    if (req.body.password.length == 0) {
        errorcode = true;
        res.status(400);
        res.render('users/signup', { errors: errors, errorcode: errorcode, message: "password cannot be null or empty" });
    }
    if (typeof req.body.password != 'string') {
        errorcode = true;
        res.status(400);
        res.render('users/signup', { errorcode: errorcode, errors: errors, hasErrors: true, message: "The entered password must be a string" });
    }
    var len;
    for (var i = 0, len = req.body.password.length; i < len; ++i) {
        if (req.body.password.charAt(i) === ' ') {
            errorcode = true;
            res.status(400);
            res.render('users/signup', { errorcode: errorcode, errors: errors, hasErrors: true, message: "Name cannot have spaces!" });
        }
    }
    if (req.body.password.length < 6) {
        errorcode = true;
        res.status(400);
        res.render('users/signup', { errorcode: errorcode, errors: errors, hasErrors: true, message: "Password should be greater than 6 characters" });
    }
    if (req.body.username.trim().length == 0) {
        errorcode = true;
        res.status(400);
        res.render('users/signup', { errorcode: errorcode, errors: errors, hasErrors: true, message: "Username cannot have spaces" });
    }
    if (req.body.password.trim().length == 0) {
        errorcode = true;
        res.status(400);
        res.render('users/signup', { errorcode: errorcode, errors: errors, hasErrors: true, message: "Password cannot have spaces" });
    }
    if (req.body.age > 150 || req.body.age <= 0) {
        errorcode = true;
        res.status(400);
        res.render('users/signup', { errorcode: errorcode, errors: errors, hasErrors: true, message: "Age should be between 1 to 150" });
    }
    if (!req.body.age) {
        errorcode = true;
        res.status(400);
        res.render('users/signup', { errorcode: errorcode, errors: errors, hasErrors: true, message: "Enter Age" });
    }
    if (!req.body.email) {
        errorcode = true;
        res.status(400);
        res.render('users/signup', { errorcode: errorcode, errors: errors, hasErrors: true, message: " Email not provided" });
    }
    if (!req.body.username) {
        errorcode = true;
        res.status(400);
        res.render('users/signup', { errorcode: errorcode, errors: errors, hasErrors: true, message: "Enter your username" });
    }
    if (req.body.username.length < 4) {
        errorcode = true;
        res.status(400);
        res.render('users/signup', { errorcode: errorcode, errors: errors, hasErrors: true, message: "Username length should be more than 3" });
    }

    // const userData = req.body;
    let userData = (req.body);
    console.log("userData", userData)

    userData.firstname = xss(userData.firstname);
    userData.lastname = xss(userData.lastname);
    userData.email = xss(userData.email);
    userData.username = xss(userData.username);
    userData.password = xss(userData.password);
    userData.profilePicture = xss(userData.profilePicture);
    userData.age = xss(userData.age);



    console.log("*something new inside try")
    const user = await users.createUser(userData.firstname, userData.lastname, userData.email, userData.username, userData.password, userData.profilePicture, userData.age);

    console.log("User inside try", user)
    if (user == null) {
        errorcode = true;
        res.status(400);
        res.render('users/signup', { errorcode: errorcode, message: "Username already exists with that username" });
    } else {
        if (user) {
            errorcode = true;
            console.log("user****", user)

            res.status(200).render("users/login", { errorcode: errorcode, message: "You have successfully signed up", title: "Login", heading: "Login" });
        } else {
            res.status(400);
            res.render("users/signup", { errorcode: errorcode, message: "Either the username or password is invalid, Please signup again", title: "Signup", heading: "Signup" });
        }
    }
});


router.get("/logout", (req, res) => {
    if (!req.session.AuthCookie)
        res.redirect("/");
    else {
        req.session.destroy();
        res.render("users/logout", { title: "Logout", heading: "Logout", message: "User successfully logged out", msg: true });
    }
});

router.get("/private", async (req, res) => {

    if (!req.session.AuthCookie) {
        res.redirect('/');
    } else {

        console .log('aaaad',req.session.customer)
        const getReviews = await reviewsData.getReviewsPerCustomer(req.session.user.id);
        const user=await users.getCustomerById(req.session.user.id)
        console.log('sssssa',user )
        req.session.customer=user
        console.log('sdfsds',req.session.customer.cart)
        console.log(getReviews, 'getReviews************')
        res.render('users/private', {
            id: req.session.user.id,
            username: req.session.customer.username,
            firstname: req.session.customer.firstname,
            lastname: req.session.customer.lastname,
            age: req.session.customer.age,
            email: req.session.customer.email,
            password: req.session.customer.password,
            getReviews: getReviews,  
            cart:req.session.customer.cart
        });
    }
});
module.exports = router;