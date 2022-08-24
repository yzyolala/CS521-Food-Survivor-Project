const connection = require('../config/mongoConnection');
const data = require("../data/");
const commentsData = data.comments;
const customersData = data.customers;
const reviewsData = data.reviews;
const restaurantsData = data.restaurants;
// const testData = data.test;

async function main() {

    const db = await connection.dbConnection();
    await db.dropDatabase();
    //   Creating Restaurant Profile
    const user0 = await customersData.createUser("Zhenying", "Yu", "yzy@gmail.com", "demouser", "demopassword", "", "24");
    console.log(user0, "User0 created successfully");

    const r1 = await restaurantsData.create("Pizzeria", "732 Jefferson St, Hoboken, NJ", "07030", 4,"Buffalo Chicken Pizza")
    console.log("r1 has been added successfully")

    const r2 = await restaurantsData.create("Del Frisco's Grille", "221 River St, Hoboken, NJ", "07030", 5,"DEL'S DEVILED EGGS")
    console.log("r2 has been added successfully")

    const r3 = await restaurantsData.create("Court Street", "61 6th St, Hoboken, NJ", "07030", 10,"Smoked Simon")
    console.log("r3 has been added successfully")

    const r4 = await restaurantsData.create("Muteki Ramen", "533 Washington St, Hoboken, NJ", "07030",7, "Shrimp Tempura")
    console.log("r4 has been added successfully")

    const r5 = await restaurantsData.create("Bareburger", "515 Washington St, Hoboken, NJ", "07030", 4,"Blazin' Bacon")
    console.log("r5 has been added successfully")

    const r6 = await restaurantsData.create("Battello", "502 Washington Blvd, Jersey City, NJ", "07310", 4,"HAMACHI CRUDO")
    console.log("r6 has been added successfully")

    const r7 = await restaurantsData.create("Fire & Oak", "479 Washington Blvd, Jersey City, NJ", "07310",19, "NEW ENGLAND CLAM CHOWDER")
    console.log("r7 has been added successfully")

    const r8 = await restaurantsData.create("DOMODOMO", "200 Greene St, Jersey City, NJ", "07311", 30,"White fish crudo")
    console.log("r8 has been added successfully")

    const r9 = await restaurantsData.create("Satis Bistro", "212 Washington St, Jersey City, NJ", "07302",4, "Brick Pressed Half Chicken")
    console.log("r9 has been added successfully")

    const r10 = await restaurantsData.create("Luna", "279 Grove St, Jersey City, NJ", "07302", 7,"Churro Ice Cream Sandwich")
    console.log("r10 has been added successfully")
    //   Creating Customers Profile
    const user1 = await customersData.createUser("Chaitanya", "Pawar", "chaitanyap@gmail.com", "chaitanya", "pawarr", "", "25");
    const user2 = await customersData.createUser("Zhenying", "Yu", "zhenyingyu6@gmail.com", "yzyolala", "qawsed", "", "28");
    // Creating Reviews
    const review11 = await reviewsData.create(r1._id, user1._id, 'This is amazing', 9)
    // console.log(review11)
    console.log('Reviews11 added successfully')
    // Creating Comment 
    const comment1 = await commentsData.addComment(
        user1._id,
        review11._id,
        "It is really good."
    );
    // console.log(comment1)
    console.log("Comment1 added successfully");

    const comment2 = await commentsData.addComment(
        user1._id,
        review11._id,
        "I liked it too."
    );
    // console.log(comment2)
    console.log("Comment2 added successfully");
    console.log('Finished seeding database');
    await connection.closeConnection();
};

main().catch((error) => {
    console.log(error);
})
