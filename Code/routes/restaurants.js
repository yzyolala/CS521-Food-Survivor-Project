const express = require('express');
const router = express.Router();
const data = require('../data');
const restaurantsData = data.restaurants;
const reviewsData = data.reviews;
const customers = data.customers;
const xss = require('xss');

router.get('/restaurants', async (req, res) => {
    try {
        const restaurantsList = await restaurantsData.getAll();
        res.status(200).render("restaurants/list", { restaurantsList });
    } catch (e) {
        res.status(400).render("restaurants/error", { error: e });
    }
});

router.get('/restaurants/:restaurantId', async (req, res) => {
    let errorcode = false;
    const errors = [];
    if (!req.params.restaurantId) {
        errorcode = true;
        res.status(400);
        return res.render("restaurants/error", { errorcode: errorcode, errors: errors, message: "should provide valid restaurant Id" });
    }
    if (typeof req.params.restaurantId != 'string') {
        errorcode = true;
        res.status(400);
        return res.render("restaurants/error", { errorcode: errorcode, errors: errors, message: "should provide restaurant Id in string" });
    }
    try {
        let restaurantsId = await restaurantsData.get(req.params.restaurantId);
        let getReviews = await reviewsData.getAllreviewsofRestaurant(req.params.restaurantId)
        console.log("getReviews", getReviews)

        res.status(200).render("restaurants/restaurantprofile", { restaurantId: restaurantsId._id, name: restaurantsId.name, foodmenu: restaurantsId.foodmenu, address: restaurantsId.address, zip: restaurantsId.zip, rating: restaurantsId.rating, getReviews: getReviews });
    } catch (e) {
        res.status(400).render("restaurants/error", { error: e });
    }
});

router.get("/manage", async (req, res) => {
    if (!req.session.AuthCookie) {
        res.status(400).render("restaurants/error", { message: "Please login to add a new restaurant listing!!" });
    }
    try {
        const restaurantsList = await restaurantsData.getAll();
        res.status(200).render("restaurants/restaurantsignup", { restaurantsList: restaurantsList });
    } catch (e) {
        res.status(400).render("restaurants/error", { error: e });
    }
});

router.get("/manage", (req, res) => {
    console.log("req.session.AuthCookie*********", req.session.AuthCookie)
    if (!req.session.AuthCookie)
        res.redirect("restaurants/restaurantsignup", { title: "Login", heading: "Login" });
    else
        res.redirect("/manage");
});


router.post('/post', async (req, res) => {
    let restaurantInfo = req.body;
    restaurantInfo.name = xss(restaurantInfo.name)
    restaurantInfo.foodmenu = xss(restaurantInfo.foodmenu)
    restaurantInfo.address = xss(restaurantInfo.address)
    restaurantInfo.zip = xss(restaurantInfo.zip)

    let errorcode = false;
    const errors = [];
    if (!req.session.AuthCookie) {
        res.status(401).redirect("/");
    }
    if (!restaurantInfo) {
        errorcode = true;
        res.status(400);
        return res.render("restaurants/restaurantsignup", { errorcode: errorcode, errors: errors, message: "Please enter all the fields" });
    }
    if (!restaurantInfo.name) {
        errorcode = true;
        res.status(400);
        return res.render("restaurants/restaurantsignup", { errorcode: errorcode, errors: errors, message: "Please provide a valid name" });

    }
    if (typeof restaurantInfo.name != 'string') {
        errorcode = true;
        res.status(400);
        return res.render("restaurants/restaurantsignup", { errorcode: errorcode, errors: errors, message: "Please provide a name in string format" });
    }
    if (!restaurantInfo.foodmenu) {
        errorcode = true;
        res.status(400);
        return res.render("restaurants/restaurantsignup", { errorcode: errorcode, errors: errors, message: "Please provide a valid restaurant menu" });
    }
    if (typeof restaurantInfo.foodmenu != 'string') {
        errorcode = true;
        res.status(400);
        return res.render("restaurants/restaurantsignup", { errorcode: errorcode, errors: errors, message: "Please provide a restaurant menu in string" });
    }
    if (!restaurantInfo.address) {
        errorcode = true;
        res.status(400);
        return res.render("restaurants/restaurantsignup", { errorcode: errorcode, errors: errors, message: "Please provide a valid address" });
    }
    if (typeof restaurantInfo.address != 'string') {
        errorcode = true;
        res.status(400);
        return res.render("restaurants/restaurantsignup", { errorcode: errorcode, errors: errors, message: "Please provide a address in string" });
    }
    if (!restaurantInfo.zip) {
        errorcode = true;
        res.status(400);
        return res.render("restaurants/restaurantsignup", { errorcode: errorcode, errors: errors, message: "Please provide a zip code" });
    }
    if (typeof restaurantInfo.zip != 'string') {
        errorcode = true;
        res.status(400);
        return res.render("restaurants/restaurantsignup", { errorcode: errorcode, errors: errors, message: "Please provide a zip code in string" });
    }

    try {
        const newRestaurant = await restaurantsData.create(
            restaurantInfo.name,
            restaurantInfo.address,
            restaurantInfo.zip,
            restaurantInfo.foodmenu,
        );
        console.log("newRestaurant", newRestaurant)
        res.status(200).render("restaurants/message", { message: "Restaurant created successfully" });
    } catch (e) {
        res.status(400).render("restaurants/error", { message: "not created", error: e });
    }
});

router.get('/restaurants/:restaurantId/delete', async (req, res) => {
    let errorcode = false;
    const errors = [];
    if (!req.session.AuthCookie) {
        return res.render("restaurants/error", { errorcode: errorcode, errors: errors, message: "You cant delete this restaurant as you are not loggedIn!" });
    }
    if (!req.params.restaurantId) {
        errorcode = true;
        res.status(400);
        return res.render("restaurants/error", { errorcode: errorcode, errors: errors, message: "should provide valid restaurant Id to delete" });
    }
    if (typeof req.params.restaurantId != 'string') {
        errorcode = true;
        res.status(400);
        return res.render("restaurants/error", { errorcode: errorcode, errors: errors, message: "Restaurant ID should be in string" });
    }

    const user = req.session.user
    console.log("user", user.id)

    try {
        var getId = await restaurantsData.get(req.params.restaurantId);
        console.log("getId", getId);
        if (user.id == null || !user.id) {
            errorcode = true;
            res.status(400);
            return res.render("restaurants/error", { errorcode: errorcode, errors: errors, message: "You cant delete this restaurant as you are not loggedIn!" });
        } else {
            var deleteRestaurant = await restaurantsData.remove(req.params.restaurantId);
            if (deleteRestaurant) {
                return res.render("restaurants/delete", { message: "deleted" });
            } else {
                res.status(400).render("restaurants/error", { message: 'not deleted' });
            }
        }
    } catch (e) {
        res.status(400).render("restaurants/error", { error: 'Restaurant not found' });
        return;
    }

});

router.post('/restaurants/:restaurantId/edit', async (req, res) => {
    const updatedData = req.body;
    console.log("updatedData", updatedData)
    updatedData.name = xss(updatedData.name)
    updatedData.address = xss(updatedData.address)
    updatedData.zip = xss(updatedData.zip)
    updatedData.foodmenu = xss(updatedData.foodmenu)

    let errorcode = false;
    const errors = [];
    if (!req.session.AuthCookie) {
        res.status(401).render("restaurants/routemessage", { message: "Please you will have to login for editing a restaurant" });
    }
    if (!req.params.restaurantId) {
        errorcode = true;
        res.status(400);
        return res.render("restaurants/editrestaurant", { errorcode: errorcode, errors: errors, message: "should provide valid Restaurant Id" });
    }
    if (typeof req.params.restaurantId != 'string') {
        errorcode = true;
        res.status(400);
        return res.render("restaurants/editrestaurant", { errorcode: errorcode, errors: errors, message: "Id should be in string" });
    }

    if (!updatedData) {
        errorcode = true;
        res.status(400);
        return res.render("restaurants/editrestaurant", { errorcode: errorcode, errors: errors, message: "Please enter all the fields" });
    }
    if (!updatedData.name) {
        errorcode = true;
        res.status(400);
        return res.render("restaurants/editrestaurant", { errorcode: errorcode, errors: errors, message: "Please provide a valid name" });
    }
    if (typeof updatedData.name != 'string') {
        errorcode = true;
        res.status(400);
        return res.render("restaurants/editrestaurant", { errorcode: errorcode, errors: errors, message: "Please provide a name in string format" });
    }
    if (!updatedData.address) {
        errorcode = true;
        res.status(400);
        return res.render("restaurants/editrestaurant", { errorcode: errorcode, errors: errors, message: "Please provide a valid address" });
    }
    if (typeof updatedData.address != 'string') {
        errorcode = true;
        res.status(400);
        return res.render("restaurants/editrestaurant", { errorcode: errorcode, errors: errors, message: "Please provide a address in string" });
    }
    if (!updatedData.zip) {
        errorcode = true;
        res.status(400);
        return res.render("restaurants/editrestaurant", { errorcode: errorcode, errors: errors, message: "Please provide a zip code" });
    }
    if (typeof updatedData.zip != 'string') {
        errorcode = true;
        res.status(400);
        return res.render("restaurants/editrestaurant", { errorcode: errorcode, errors: errors, message: "Please provide a zip code in string" });
    }
    if (!updatedData.foodmenu) {
        errorcode = true;
        res.status(400);
        return res.render("restaurants/editrestaurant", { errorcode: errorcode, errors: errors, message: "Please provide a restaurant menu" });
    }
    if (typeof updatedData.foodmenu != 'string') {
        errorcode = true;
        res.status(400);
        return res.render("restaurants/editrestaurant", { errorcode: errorcode, errors: errors, message: "Please provide a restaurant menu in string" });
    }

    if (!updatedData.name || !updatedData.address || !updatedData.zip || !updatedData.foodmenu) {
        errorcode = true;
        res.status(400);
        return res.render("restaurants/editrestaurant", { errorcode: errorcode, errors: errors, message: "Please enter all the fields" });
    }

    try {
        console.log(await restaurantsData.get(req.params.restaurantId));
    } catch (e) {
        res.status(400).json({ error: e });
        return;
    }
    try {
        const updatedRestaurant = await restaurantsData.update(req.params.restaurantId, updatedData.name, updatedData.address, updatedData.zip, updatedData.foodmenu);
        res.render('restaurants/message', { message: "Updated successfully", updatedRestaurant: updatedRestaurant });
    } catch (e) {
        res.status(400).render("restaurants/error", { error: e });
    }
});

router.get('/restaurants/:restaurantId/edit', async (req, res) => {
    let errorcode = false;
    const errors = [];
    if (!req.session.AuthCookie) {
        res.status(400).redirect("/");
    }
    if (!req.params.restaurantId) {
        errorcode = true;
        res.status(400);
        return res.render("restaurants/editrestaurant", { errorcode: errorcode, errors: errors, message: "should provide valid restaurants Id" });
    }
    if (typeof req.params.restaurantId != 'string') {
        errorcode = true;
        res.status(400);
        return res.render("restaurants/editrestaurant", { errorcode: errorcode, errors: errors, message: "Id should be in string" });
    }
    try {
        let restaurantsId = await restaurantsData.get(req.params.restaurantId);
        res.status(200).render("restaurants/editrestaurant", { restaurantId: restaurantsId._id, name: restaurantsId.name, address: restaurantsId.address, zip: restaurantsId.zip });
    } catch (e) {
        res.status(404).render("restaurants/error", { error: e });
    }
});

router.post('/search', async (req, res) => {
    try {
        var demo = req.body;
        demo.name = xss(demo.name)
        const data = await restaurantsData.getRestaurantViaSearch(demo.name);
        console.log("data", data)
        var demo1 = {}
        for (var i = 0; i < data.length; i++) {
            demo1[i] = data[i]
        }
        var test = Object.values(demo1)
        console.log(test)
        res.render('restaurants/searchterm', { data: test, demo });
    } catch (error) {
        var errorDescription = {
            className: "No name supplied",
            message: `No name was supplied *******`,
            hasErrors: "Error",
            title: "Restaurant Found"
        }
        res.status(400).render("restaurants/error", errorDescription)
    }
});

module.exports = router;