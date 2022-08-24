const mongoCollections = require('../config/mongoCollections');
const restaurants = mongoCollections.restaurants;
let { ObjectId } = require('mongodb');

const create = async function create(name, address, zip, foodmenu, magicbox) {
    if (!name) throw 'You must provide a name for your restaurant';
    if (!address) throw 'You must provide a address for your restaurant';

    //To check name is null or empty
    if (name.length == 0 || name === null) {
        throw 'Name cannot be null or empty'
    }
    //To check name is string
    if (typeof name != 'string') {
        throw 'The entered name must be a string'
    }
    //To check address is null or empty
    if (address.length == 0 || address === null) {
        throw 'address cannot be null or empty'
    }
    //To check address is string
    if (typeof address != 'string') {
        throw 'The entered address must be a string'
    }
    //To check zip is null or empty
    if (zip.length == 0 || zip === null) {
        throw 'stzipate cannot be null or empty'
    }
    //To check magicbox is null or empty
    if (magicbox.length == 0 || magicbox === null) {
        throw 'Name cannot be null or empty'
    }
    //To check zip is number
    if (typeof magicbox != "string") {
        throw "The magicbox must be string!"
    }
    // if (magicbox < 0 || magicbox > 100) {
    //     throw "The magicbox should be in he range of [0,100]!"
    // }
    //To check zip is string
    if (typeof zip != 'string') {
        throw 'The entered zip must be a string'
    }
    if (name.trim().length == 0) {
        throw "name cannot have spaces"
    }
    if (address.trim().length == 0) {
        throw "address cannot have spaces"
    }

    if (zip.trim().length == 0) {
        throw "zip cannot have spaces"
    }
    if (foodmenu.length == 0) {
        throw 'Menu cannot be null or empty'
    }
    if (typeof foodmenu != 'string') {
        throw 'The entered menu must be a string'
    }
    if (foodmenu.trim().length == 0) {
        throw "menu cannot have spaces"
    }



    const restaurantsCollection = await restaurants();

    let newrestaurants = {
        name: name,
        address: address,
        zip: zip,
        foodmenu: foodmenu,
        magicbox: magicbox,
        rating: 0,
        reviewId: []
    };

    const allrestaurants = await this.getAll();
    allrestaurants.forEach(element => {
        for (var i = 0; i < element.name.length; i++) {
            if (element.name === name) {
                throw "Restaurants name already in use"
            }
        }
    });
    const insertInfo = await restaurantsCollection.insertOne(newrestaurants);
    if (insertInfo.insertedCount === 0) throw 'Could not add restaurants';

    const newId = insertInfo.insertedId;
    const restaurant = await this.get(newId.toString());
    return JSON.parse(JSON.stringify(restaurant));
}

const get = async function get(restaurantId) {
    if (!restaurantId) throw 'You must provide an restaurantId to search for';
    if (restaurantId.length == 0) {
        throw "restaurantId cannot be null or empty"
    }
    if (typeof restaurantId != 'string') {
        throw 'Entered restaurantId should be string'
    }
    let newObjId = ObjectId();
    if (!ObjectId.isValid(newObjId)) {
        throw 'Not valid ObjectID'
    }
    let x = newObjId.toString();

    let parsedId = ObjectId(restaurantId);

    const restaurantCollection = await restaurants();
    const restaurantDetails = await restaurantCollection.findOne({ _id: parsedId });
    if (restaurantDetails === null) throw 'No restaurant found with that id';

    return JSON.parse(JSON.stringify(restaurantDetails));
}

const getAll = async function getAll() {
    const restaurantCollection = await restaurants();

    const restaurantList = await restaurantCollection.find({}).toArray();
    return JSON.parse(JSON.stringify(restaurantList));
}

const remove = async function remove(restaurantId) {
    if (!restaurantId) throw 'You must provide an restaurantId to search for';
    if (restaurantId.length == 0) {
        throw 'Entered restaurantId cannot be empty'
    }
    if (typeof restaurantId != 'string') {
        throw 'Entered restaurantId should be string'
    }
    let newObjId = ObjectId();
    if (!ObjectId.isValid(newObjId)) {
        throw 'Not valid ObjectID'
    }
    let x = newObjId.toString();
    let parsedId = ObjectId(restaurantId);

    const restaurantCollection = await restaurants();
    const deletionInfo = await restaurantCollection.deleteOne({ _id: parsedId });

    if (deletionInfo.deletedCount === 0) {
        throw `Could not delete restaurant with id of ${restaurantId}`;
    }
    return { deleted: true };
}

const update = async function update(restaurantId, name, address, zip, foodmenu, magicbox) {

    if (!name) throw 'You must provide a name for your restaurant';
    if (!address) throw 'You must provide a address for your restaurant';
    if (!zip) throw 'You must provide a zip for your restaurant';
    if (!magicbox) throw 'You must provide a magicbox for your restaurant';
    //To check name is null or empty
    if (name.length == 0) {
        throw 'Name cannot be null or empty'
    }
    //To check name is string
    if (typeof name != 'string') {
        throw 'The entered name must be a string'
    }
    //To check address is null or empty
    if (address.length == 0) {
        throw 'address cannot be null or empty'
    }
    //To check address is string
    if (typeof address != 'string') {
        throw 'The entered address must be a string'
    }
    if (magicbox.length == 0 || magicbox === null) {
        throw 'Name cannot be null or empty'
    }
    //To check zip is number
    if (typeof magicbox != "string") {
        throw "The magicbox must be string!"
    }
    // if (magicbox < 0 || magicbox > 100) {
    //     throw "The magicbox should be in he range of [0,100]!"
    // }
    //To check zip is null or empty
    if (zip.length == 0) {
        throw 'stzipate cannot be null or empty'
    }
    //To check zip is string
    if (typeof zip != 'string') {
        throw 'The entered zip must be a string'
    }
    if (name.trim().length == 0) {
        throw "name cannot have spaces"
    }
    if (address.trim().length == 0) {
        throw "address cannot have spaces"
    }
    if (foodmenu.length == 0) {
        throw 'Menu cannot be null or empty'
    }
    if (typeof foodmenu != 'string') {
        throw 'The entered menu must be a string'
    }
    if (foodmenu.trim().length == 0) {
        throw "menu cannot have spaces"
    }
    let newObjId = ObjectId();
    if (!ObjectId.isValid(newObjId)) {
        throw 'Not valid ObjectID'
    }
    let x = newObjId.toString();
    let parsedId = ObjectId(restaurantId);
    if (parsedId === null) throw 'No restaurant found with that id';
    const restaurantCollection = await restaurants();
    const updatedRestaurantInfo = {
        name: name,
        address: address,
        zip: zip,
        foodmenu: foodmenu,
        magicbox: magicbox
    };

    const updateRestaurantInfo = await restaurantCollection.updateOne({ _id: parsedId }, { $set: updatedRestaurantInfo });

    if (!updateRestaurantInfo.matchedCount && !updateRestaurantInfo.modifiedCount)
        throw 'Update unsuccessfully!';

    var getParsedID = await this.get(restaurantId);
    const objCmp = JSON.parse(JSON.stringify(getParsedID));
    return objCmp;
}

const getRestaurantViaSearch = async function getRestaurantViaSearch(search) {
    console.log("search*********", search)
    if (!search) throw "Error (getRestaurantViaSearch): Must provide search.";
    if (typeof (search) !== "string") throw "Error (getRestaurantViaSearch): Search must be a string.";
    const restaurantCollection = await restaurants();
    console.log("restaurantCollection***", restaurantCollection.length)
    const query = new RegExp(search, "i");
    console.log("query", query)
    const restaurantList = await restaurantCollection.find({ $or: [{ foodmenu: { $regex: query } }, { name: { $regex: query } }] }).toArray();
    console.log("restaurantList", restaurantList);
    return restaurantList;
}

module.exports = {
    create,
    get,
    getAll,
    remove,
    update,
    getRestaurantViaSearch
}
