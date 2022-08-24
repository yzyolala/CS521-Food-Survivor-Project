const express = require('express');
const router = express.Router();
const data = require('../data/');
const restaurants = data.restaurants;
const reviews  = data.reviews;
const customers = data.customers;
const xss = require('xss');

router.get(/*buying*/'/pickRestaurant',async(req,res)=>{ 
    const allrestaurants=await restaurants.getAll()
    res.render('buying/pickRestaurant',{
        allrestaurants:allrestaurants
    })
})

router.get(/*buying*/'/pickRestaurant/:_id', async(req,res)=>{ 
    const _id=req.params._id
    const restaurant=await restaurants.get(_id)
    const l=restaurant.restaurantdishlist
    // console.log('da:',_id)
    // console.log('adf:',l)
    res.render('buying/pickDish',{
        _id:_id,
        // l:l,
        restaurant:restaurant
    })
})

router.get(/*buying*/'/finishPickingDish/:_id/:dishname', async(req,res)=>{ 
    const _id=req.params._id
    const dishname=req.params.dishname

    const allrestaurants=await restaurants.getAll()


    const updated =await restaurants.removeOneDishFromRestaurant(_id,dishname)

    // console.log('aaa',req.session)
    const user_id=req.session.user.id

    const restaurant1=await restaurants.get(_id)
    const restaurantname=restaurant1.name
    const restaurantaddress=restaurant1.address

    const added=await customers.addDishToUser(user_id,restaurantname,restaurantaddress,dishname)

    const user=await customers.getCustomerById(user_id)
    // console.log('aaxxx',user)

    req.session.customer=user

    const restaurant=await restaurants.get(_id)
    // console.log('dasfdsf',restaurant)

    // const hasDishes=restaurant.restaurantdishlist.length>0
    // const newallrestaurants=await restaurants.getAll() 
    res.render('buying/successfullyOrder',{
        restaurant:restaurant
    })
})

module.exports = router;