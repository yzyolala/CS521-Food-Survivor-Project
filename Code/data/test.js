const { ObjectId } = require("mongodb");
//const { customers } = require(".");
// const calculate = require("./calculate");
const mongoCollections = require("../config/mongoCollections");
const restaurants = mongoCollections.restaurants;
const comments = mongoCollections.comments;
const reviews = mongoCollections.reviews;
const salData = require("./restaurants");

module.exports = {};