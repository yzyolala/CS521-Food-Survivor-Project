const connection = require('../config/mongoConnection');
const data = require("../data/");
const customersData = data.customers;
const restaurantsData = data.restaurants;

async function main() {

    const db = await connection.dbConnection();
    await db.dropDatabase();

    const r1 = await restaurantsData.create("Pizzeria", "732 Jefferson St, Hoboken, NJ", "07030", "Buffalo Chicken Pizza", '4')
    console.log("r1 has been added successfully")

    const r2 = await restaurantsData.create("Del Frisco's Grille", "221 River St, Hoboken, NJ", "07030", "DEL'S DEVILED EGGS", '5')
    console.log("r2 has been added successfully")

    const r3 = await restaurantsData.create("Court Street", "61 6th St, Hoboken, NJ", "07030", "Smoked Simon", '10')
    console.log("r3 has been added successfully")

    const r4 = await restaurantsData.create("Muteki Ramen", "533 Washington St, Hoboken, NJ", "07030", "Shrimp Tempura", '7')
    console.log("r4 has been added successfully")

    const r5 = await restaurantsData.create("Bareburger", "515 Washington St, Hoboken, NJ", "07030", "Blazin' Bacon", '4')
    console.log("r5 has been added successfully")

    const r6 = await restaurantsData.create("Battello", "502 Washington Blvd, Jersey City, NJ", "07310", "HAMACHI CRUDO", '4')
    console.log("r6 has been added successfully")

    const r7 = await restaurantsData.create("Fire & Oak", "479 Washington Blvd, Jersey City, NJ", "07310", "NEW ENGLAND CLAM CHOWDER", '19')
    console.log("r7 has been added successfully")

    const r8 = await restaurantsData.create("DOMODOMO", "200 Greene St, Jersey City, NJ", "07311", "White fish crudo", '30')
    console.log("r8 has been added successfully")

    const r9 = await restaurantsData.create("Satis Bistro", "212 Washington St, Jersey City, NJ", "07302", "Brick Pressed Half Chicken", '4')
    console.log("r9 has been added successfully")

    const r10 = await restaurantsData.create("Luna", "279 Grove St, Jersey City, NJ", "07302", "Churro Ice Cream Sandwich", '7')
    console.log("r10 has been added successfully")


    //   Creating Customers Profile
    const user1 = await customersData.createUser("John", "Kolh", "john@gmail.com", "johnk", "johnkolh", "", "24");
    console.log("User 1 created successfully");

    const user2 = await customersData.createUser("Zhenying", "Yu", "zhenyingyu6@gmail.com", "yzyolala", "qawsed", "", "28");
    console.log("User 2 created successfully");

    console.log('Finished seeding database');

    await connection.closeConnection();
};

main().catch((error) => {
    console.log(error);
})
