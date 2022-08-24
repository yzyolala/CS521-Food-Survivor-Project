const mongoCollections = require('../config/mongoCollections');
var mongo = require('mongodb');
const customers = mongoCollections.customers;

const restaurants=require('./restaurants')

// ObjectId = require('mongodb').ObjectId;
const bcrypt = require('bcrypt');
const saltRounds = 7;
let { ObjectId } = require('mongodb');

module.exports = {
    async checkDuplicate(un) {
        const userCollection = await customers();
        const user1 = await userCollection.find({}).toArray();
        for (let i = 0; i < user1.length; i++) {
            let str = user1[i].username.toString();
            if (user1[i].username == un) {
                console.log('************* Check duplicate username**********************');
                return 0
            }
        }
        return 1;
    },
    async addUserProfilePicture(id, profilePicture) {
        if (!id) throw "User id is missing";
        var objRevId = ""
        if (typeof (id) === "string") objRevId = ObjectId.createFromHexString(id);
        const customerCollection = await customers();
        let updatedUserData = {};
        let gotten = await this.getCustomerById(objRevId);
        updatedUserData.profilePicture = profilePicture;
        const updateInfoUser = await customerCollection.updateOne({ _id: objRevId }, { $set: updatedUserData });
        if (updateInfoUser.modified··Count === 0 && updateInfoUser.deletedCount === 0) throw "Could not update customer";
        return await this.getCustomerById(id);
    },

    async getAllCustomers() {
        const customers_data = await customers();
        const list_all_customers = await customers_data.find({}).toArray();
        return JSON.parse(JSON.stringify(list_all_customers));

    },

    async getCustomerIdbyusername(username) {
        let userData = {};
        const customerCollection = await customers();
        const customer_details = await customerCollection.findOne({ username: "username" });
        return customer_details
    },


    async updateUser(id, cust_info) {
        if (!id) throw "id is missing";
        if (!cust_info) {
            return await this.getCustomerById(id);
        }
        if (typeof (id) === "string") id = ObjectId.createFromHexString(id);
        const userCollection = await customers();
        let newuserinfo = {};
        let gotten = await this.getCustomerById(id);
        if (JSON.stringify(cust_info) == JSON.stringify(gotten)) {
            return await this.getCustomerById(id);
        }

        if (cust_info.firstname) {
            newuserinfo.firstname = cust_info.firstname;
        }
        if (cust_info.lastname) {
            newuserinfo.lastname = cust_info.lastname;
        }
        if (cust_info.username) {

            newuserinfo.username = cust_info.username;
        }
        if (cust_info.email) {
            newuserinfo.email = cust_info.email;
        }
        if (cust_info.age) {
            newuserinfo.age = cust_info.age;
        }
        if (cust_info.profilePicture) {
            newuserinfo.profilePicture = cust_info.profilePicture;
        }
        if (cust_info.password) {
            const plainTextPassword = cust_info.password;
            const hash = await bcrypt.hash(plainTextPassword, saltRounds);
            password = hash;
            newuserinfo.password = password;
        }

        if (newuserinfo == {}) {
            return await this.getCustomerById(id);
        }
        const updateInfoUser = await userCollection.updateOne({ _id: id }, { $set: newuserinfo });
        if (updateInfoUser.modifiedCount === 0 && updateInfoUser.deletedCount === 0) throw "Could not update your details ";
        return await this.getCustomerById(id);
    },


    async getCustomerById(id) {
        if (!id) throw 'No id entered';
        if (typeof id === 'string' && id.length == 0) {
            throw 'Invalid id';
        }

        const ObjectId = require('mongodb').ObjectId;
        if (!ObjectId.isValid(id)) {
            throw 'Not a valid ObjectId';
        }


        const customerCollection = await customers();
        const customer = await customerCollection.findOne({ _id: ObjectId(id) });
        if (customer === null) throw 'Customer does not exist';
        customer._id = customer._id.toString();
        return customer;
    },

    async deleteCustomerbyId(id) {

        if (!id) throw 'No id entered';
        if (typeof id === 'string' && id.length == 0) {
            throw 'Invalid id';
        }

        const ObjectId = require('mongodb').ObjectId;
        if (!ObjectId.isValid(id)) {
            throw 'Not a valid ObjectId';
        }

        /* delete review from DB */
        const customerCollection = await customers();
        const customerinfo = await customerCollection.deleteOne({ _id: ObjectId(id) });
        if (customerinfo.deletedCount === 0) throw `Could not delete user of ${id}.`;

        return { userdeleted: true };
    },

    async createUser(firstname, lastname, email, username, password, profilePicture, age) {
        try {
            if (firstname == undefined) {
                throw 'Parameter not provided'
            }
            if (typeof firstname != "string") {
                throw 'Firstname not of type string'
            }
            firstname = firstname.toUpperCase();
            firstname = firstname.trim()
            if (!firstname) throw 'Firstname not provided or only empty spaces provided';

            function isCharacterALetter(char) {
                char = firstname
                var value = /^[a-zA-Z]+$/.test(char);
                return value
            }
            let test = isCharacterALetter(firstname)
            if (test) {
            } else {
                throw 'Firstname should only be characters'
            }
            if (typeof lastname != "string") {
                throw 'Lastname not of type string'
            }
            lastname = lastname.toUpperCase();
            lastname = lastname.trim()
            if (!lastname) throw 'Lastname not provided or only empty spaces provided';

            function isCharacterALetter(char) {
                char = lastname
                value = /^[a-zA-Z]+$/.test(char);
                return value
            }
            let test2 = isCharacterALetter(lastname)
            if (test2) {
            } else {
                throw 'Lastname should only be characters'
            }

            if (username === null || username.length == 0) throw 'You cannot enter nothing for username!'
            if (typeof username != 'string') throw 'The type of username must be string'
            if (username.length < 4) throw 'The username should have at least 4 characters'
            var regex = /^[A-Za-z0-9]+$/;
            if (!username.match(regex)) throw 'Username should be alphanumeric without any spaces or blanks.'

            const usersCollection = await customers();
            var nameLowerCase = username.toLowerCase();
            const userExists = await usersCollection.findOne({ username: nameLowerCase });
            if (userExists) throw "There is already a user with that username";

            email = email.toLowerCase()
            if (!email) {
                throw 'Email not provided'
            }
            if (email.trim().length == 0) {

                throw 'Email cannot be empty spaces'
            }

            function validateEmail(email) {
                var re = /\S+@\S+\.\S+/;
                return re.test(email);
            }
            console.log(validateEmail(email));
            let email_result = validateEmail(email)

            if (email_result) {
            } else {
                throw 'Email is not valid'
            }
            if (!password) throw 'Password not provided';
            if (typeof username != "string" || typeof password != "string") {
                throw 'Password/Username not of type string'
            }

            if (password.trim().length == 0) {
                throw 'Password cannot be empty spaces'
            }

            const plainTextPassword = password;
            const hash = await bcrypt.hash(plainTextPassword, saltRounds);
            password = hash;

            let newUser = {
                username: username,
                password: password,
                firstname: firstname,
                lastname: lastname,
                email: email,
                profilePicture: profilePicture,
                age: age,
                reviewId: [],
                commentIds: [],
                cart:[]

            };

            const insertInfo = await usersCollection.insertOne(newUser);
            if (insertInfo.insertedCount === 0) throw 'We cannot add a new user.';
            console.log("{ userInserted: true }");
            return this.getCustomerById(insertInfo.insertedId);
        } catch (error) {
            console.log(error)
        }
    },

    async checkUser(username, password) {
        try {
            if (username === null || username.length == 0) throw 'You cannot enter nothing for username!'
            if (typeof username != 'string') throw 'The type of username must be string'
            if (username.length < 4) throw 'Username should have at least 4 characters'
            var regex = /^[A-Za-z0-9]+$/;
            if (!username.match(regex)) throw 'Username should be alphanumeric without any spaces or blanks.'

            if (password === null || password.length == 0) throw 'You cannot enter nothing for password!'
            if (typeof password != 'string') throw 'The type of password must be string'
            var regex2 = /^[\u4e00-\u9fa5_a-zA-Z0-9]+$/
            if (!password.match(regex2)) throw 'Password cannot include any spaces or blanks.'
            if (password.length < 6) throw 'Password should be at least 6 characters.'

        } catch (error) {
            console.log(error)
        }

        const usersCollection = await customers();
        var nameLowerCase = username.toLowerCase();
        const userData = await usersCollection.findOne({ username: nameLowerCase });

        try {
            if (!userData) throw "Either the username or password is invalid";
        } catch (error) {
            console.log(error)
        }

        let compareToMatch = await bcrypt.compare(password, userData.password);
        if (compareToMatch) {
            console.log("{ authenticated: true }");
            return { authenticated: true }
        }
        else {
            throw "Either the username or password is invalid"
        }
    } ,
    async addDishToUser(_id,restaurantname,restaurantaddress,dishname)
    {
        const user=await this.getCustomerById(_id)
        // console. log(user)
        let l=user.cart
        
        let has=false
        for(let i in l)
        {
            if(l[i].restaurantname===restaurantname &&  
                l[i].restaurantaddress===restaurantaddress &&l[i].dishname===dishname) 
            {
                has=true
                l[i].count+=1
                break
            }
        }
        // const restaurantsF=await mongoCollections.restaurants
        // const restaurantCollection=await restaurantsF()
        const restaurant_id=await restaurants.getByNameAddress(restaurantname,restaurantaddress)
        // ( restaurantname,restaurantaddress)

        const restaurant=await restaurants.get(restaurant_id.toString())
        console.log('sarrr',restaurant)

        if(!has)l.push(
        
        {restaurantname:restaurantname,restaurantaddress:restaurantaddress ,
        dishname:dishname,count:1})
        // user.cart=l
        // console.log('sss',user)
        
        const userCollection=await customers()
        
        // const customer = await userCollection.findOne({ _id: ObjectId(_id) });
        // console.log('sssss',customer )

        const updated=await userCollection.updateOne({_id:ObjectId(_id)},{$set:{cart:l}})
        // console.log(updated)

        const newuser=await this.getCustomerById(_id)
        // req.session.customer=newuser
        console.log ('aats',newuser)
        return {added:true,newuser:newuser}
    },
};