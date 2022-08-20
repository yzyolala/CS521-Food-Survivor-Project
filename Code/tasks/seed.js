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
    const DreamZ = await restaurantsData.create("DreamZ Beauty Restaurant", "Washington Street Hoboken", "07030", "Idli Sambar, Dosa")
    console.log(DreamZ, "DreamZ has been added successfully")

    const Telogen = await restaurantsData.create("Telogen Restaurant & Bar", "Washington Street Hoboken", "07030", "Idli Sambar, Dosa")
    console.log(Telogen, "Telogen has been added successfully")

    const Roger = await restaurantsData.create("Roger Markel Restaurant", "Washington Street Hoboken", "07030", "Idli Sambar, Dosa")
    console.log(Roger, "Roger has been added successfully")

    const Bloom = await restaurantsData.create("Bloom berk lounge", "Washington Street Hoboken", "07030", "Idli Sambar, Dosa")
    console.log(Bloom, "Bloom has been added successfully")

    const Aerea = await restaurantsData.create("The Aerea Restaurant", "Washington Street Hoboken", "07030", "Idli Sambar, Dosa")
    console.log(Aerea, "Aerea has been added successfully")

    const Madison = await restaurantsData.create("Madison Reed Restaurant", "Washington Street Hoboken", "07030", "Idli Sambar, Dosa")
    console.log(Madison, "Madison has been added successfully")

    const Caru = await restaurantsData.create("The Restaurant Caru", "Washington Street Hoboken", "07030", "Idli Sambar, Dosa")
    console.log(Caru, "Caru has been added successfully")

    const Phoenix = await restaurantsData.create("Restaurant Phoenix", "Washington Street Hoboken", "07030", "Idli Sambar, Dosa")
    console.log(Phoenix, "Phoenix has been added successfully")

    const Hudson = await restaurantsData.create("Hudson Sqaure Restaurant", "Washington Street Hoboken", "07030", "Idli Sambar, Dosa")
    console.log(Hudson, "Hudson has been added successfully")

    const Sole = await restaurantsData.create("Sole Restaurant", "Washington Street Hoboken", "07030", "Idli Sambar, Dosa")
    console.log(Sole, "Sole has been added successfully")

    const UpOut = await restaurantsData.create("Up & Out Restaurant", "Washington Street Hoboken", "07030", "Idli Sambar, Dosa")
    console.log(UpOut, "UpOut has been added successfully")

    const Sorella = await restaurantsData.create("Sorella Mia", "Washington Street Hoboken", "07030", "Idli Sambar, Dosa")
    console.log(Sorella, "Sorella has been added successfully")

    //   Creating Customers Profile
    const user1 = await customersData.createUser("John", "Kolh", "john@gmail.com", "johnk", "johnkolh", "", "24");
    console.log(user1, "User 1 created successfully");

    const user2 = await customersData.createUser("Kate", "Ken", "kate@gmail.com", "katekk", " katekk123", "", "21");
    console.log(user2, "User 2 created successfully");

    const user3 = await customersData.createUser("Tonny", "Keith", "tonny@gmail.com", "tonnykk", "tonnykeith@123", "", "23");
    console.log(user3, "User 3 created successfully");

    const user4 = await customersData.createUser("Richard", "Endrew", "richard@gmail.com", "richardend", "richard@1234", "", "24");
    console.log(user4, "User 4 created successfully");

    const user5 = await customersData.createUser("Samuel", "jage", "samuel@gmail.com", "samueljage", "samuel@12", "", "20");
    console.log(user5, "User 5 created successfully");

    const user6 = await customersData.createUser("Raymond", "wright", "raymond@gmail.com", "raymondwright", "raymond@w123", "", "26");
    console.log(user6, "User 6 created successfully");

    const user7 = await customersData.createUser("nina", "dobrev", "nina@gmail.com", "ninadob", "ninadob@rev", "", "24");
    console.log(user7, "User 7 created successfully");

    const user8 = await customersData.createUser("shraddha", "khair", "shraddha@gmail.com", "shraddhak", "shraddha123kh", "", "25");
    console.log(user8, "User 8 created successfully");

    const user9 = await customersData.createUser("Savleen", "Kaur", "savleen@gmail.com", "savleenkaur", "savleenk@678kaur", "", "24");
    console.log(user9, "User 9 created successfully");

    const user10 = await customersData.createUser("Prateek", "Upereti", "prateek@gmail.com", "prateekup", "prateek@123", "", "24");
    console.log(user10, "User 10 created successfully");

    const user11 = await customersData.createUser("Muzzaffar", "Turak", "muzzaffar@gmail.com", "muzzaffar", "muzzaffartu", "", "24");
    console.log(user11, "User 11 created successfully");
    // Creating Reviews
    const review11 = await reviewsData.create(DreamZ._id, user1._id, 'This is amazing', 9)
    console.log(review11)
    console.log('Reviews11 added successfully')
    // Creating Comment 
    const comment1 = await commentsData.addComment(
        user1._id,
        review11._id,
        "It is really good."
    );
    console.log(comment1)
    console.log("Comment1 added successfully");

    const comment2 = await commentsData.addComment(
        user1._id,
        review11._id,
        "I liked it too."
    );
    console.log(comment2)
    console.log("Comment2 added successfully");
    console.log("Comment22 added successfully");

    console.log('Finished seeding database');
    await connection.closeConnection();
};

main().catch((error) => {
    console.log(error);
});
