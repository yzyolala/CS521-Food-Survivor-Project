const { response } = require('express');
const express = require('express');
const { reviews } = require('../config/mongoCollections');
const router = express.Router();
const data = require('../data');
const reviewsData = data.reviews;
const dataInfo = require("../data");
const customers = data.customers;
const restaurants = data.restaurants;
const comments = data.comments;
const xss = require('xss');

//Get data using restaurant id
router.get('/reviews/restaurants/:restaurantId', async (req, res) => {
  if (!req.session.AuthCookie) {
    res.redirect("/");
  }
  console.log(req.params.restaurantId, 'id from routes')
  if (!req.params.restaurantId) {
    res.status(400).render("reviews/error", { message: "You must provide a valid Restaurant ID for review" })
    return;
  }
  if (req.params.restaurantId == null || req.params.restaurantId.length == 0) {
    res.status(400).render("reviews/error", { message: "You must provide a Restaurant Id that is not null for review" })
    return;
  }
  if (req.params.restaurantId.trim() == '') {
    res.status(400).render("reviews/error", { message: "Blank spaces are provided in RestaurantID" })
    return;
  }
  try {
    const salData = await restaurants.get(req.params.restaurantId)
    const restaurantList = await reviewsData.getAllreviewsofRestaurant(req.params.restaurantId);
    var demo1 = {}
    for (var i = 0; i < restaurantList.length; i++) {
      demo1[i] = restaurantList[i]
    }
    var test = Object.values(demo1)

    res.status(200).render("restaurants/restaurantprofile", { test: test })
  } catch (e) {
    res.status(400).render("reviews/error", { message: e })
  }
});

//get using review id
router.get('/:reviewId', async (req, res) => {
  if (!req.session.AuthCookie) {
    res.redirect("/");
  }
  if (!req.params.reviewId) {
    res.status(400).render("reviews/error", { message: "You must provide a Review ID for review" })
    return;
  }
  try {
    const reviewList = await reviewsData.getReviewId(req.params.reviewId);
    const salData = await restaurants.get(reviewList.restaurantId)
    const custData = await customers.getCustomerById(reviewList.customersId)
    res.status(200).render("reviews/reviewbyid", { restaurantId: reviewList.restaurantId, name: salData.name, username: custData.username, customersId: reviewList.customersId, reviewText: reviewList.reviewText, rating: reviewList.rating, _id: req.params.reviewId })
  } catch (e) {
    res.status(400).render("reviews/error", { message: e })
  }
});

//check
router.get('/reviews/alldata/:reviewId', async (req, res) => {
  if (!req.session.AuthCookie) {
    res.redirect("/");
  }
  if (!req.params.reviewId) {
    res.status(400).render("reviews/error", { message: "You must provide a Review ID for review" })
    return;
  }
  try {
    const reviewList = await reviewsData.getReviewId(req.params.reviewId)
    res.status(200).render("reviews/review", { reviewList });
  } catch (e) {
    res.status(400).render("reviews/error", { message: e })
  }
});

//get all reviews by a customer
router.get('/reviews/customer/:customersId', async (req, res) => {
  if (!req.session.AuthCookie) {
    res.redirect("/");
  }
  if (req.params.customersId.length === 0 || req.params.customersId.length !== 24) {
    res.status(400).render("reviews/error", { message: 'Customer id should be a non empty string' })
    return;
  }

  console.log(req.session, 'req.session')
  console.log(session_user_id, 'session_user_id form review route')
  const user = session_user_id
  console.log(user, 'user: post review')
  if (!req.params.customersId) {
    res.status(400).render("reviews/error", { message: 'You must provide a Customer ID for review' })
    return;
  }
  try {
    const custData = await customers.getCustomerById(user)
    const reviewList = await reviewsData.getReviewsPerCustomer(req.params.customersId);
    res.status(200).render("users/private", { reviewList: reviewList });
  } catch (e) {
    res.status(400).render("reviews/error", { message: e })
  }
});

//create a review
router.post('/reviews/:restaurantId', async (req, res) => {
  if (!req.session.AuthCookie) {
    res.redirect("/");
  }
  let reviewData = req.body;
  reviewData.reviewText = xss(reviewData.reviewText)
  reviewData.rating = xss(reviewData.rating)
  const user = req.session.user

  if (!req.params.restaurantId || req.params.restaurantId.length == 0 || req.params.restaurantId.trim() == '') {
    res.status(400).render("reviews/error", { message: 'You must provide a valid Restaurant ID for review' });
    return;
  }
  if (typeof req.params.restaurantId != 'string') {
    res.status(400).render("reviews/error", { message: 'No Restaurant with proper type has been provided' });
    return;
  }
  if (!reviewData.reviewText || reviewData.reviewText.trim() == '' || reviewData.reviewText == null) {
    res.status(400).render("reviews/error", { message: 'You must provide a review' });
    return;
  }
  if (typeof reviewData.reviewText != 'string') {
    res.status(400).render("reviews/error", { message: 'You must provide a string for review' });
    return;
  }
  if (!reviewData.rating) {
    res.status(400).render("reviews/error", { message: 'You must provide a rating' });
    return;
  }
  if (reviewData.rating < 1 || reviewData.rating > 11) {
    res.status(400).render("reviews/error", { message: 'Rating cannot be less than 1 or greater than 10' });
    return;
  }
  try {
    const newPost = await reviewsData.create(
      req.params.restaurantId,
      user.id,
      reviewData.reviewText,
      reviewData.rating,
    );
    const salData = await restaurants.get(newPost.restaurantId)
    const custData = await customers.getCustomerById(newPost.customersId)
    res.status(200).render("reviews/restaurantreview", { restaurantId: newPost.restaurantId, name: salData.name, username: custData.username, customersId: newPost.customersId, reviewText: newPost.reviewText, rating: newPost.rating, _id: req.params.reviewId });
  } catch (e) {
    res.status(400).render("reviews/error", { message: e })
  }
});

//delete review
router.get('/reviews/deletereview/:reviewId', async (req, res) => {
  if (!req.session.AuthCookie) {
    res.redirect("/");
  }
  if (!req.params.reviewId) {
    res.status(400).render("reviews/error", { message: 'You must Supply an ID to delete' });
    return;
  }
  const user = req.session.user
  try {
    var reviewtoDelete = await reviewsData.getReviewId(req.params.reviewId);
    if (user.id != reviewtoDelete.customersId) {
      res.status(400).render("reviews/error", { message: "You cant delete this review as you did not post it!" })
    }
    else {
      const deletereview = await reviewsData.removeReview(req.params.reviewId);
      res.status(200).render('reviews/deletereview', { message: 'Deleted your review successfully' })
    }
  } catch (e) {
    res.status(400).render("reviews/error", { message: e });
  }
});

//get to edit the review
router.get('/reviews/updatereview/:reviewId', async (req, res) => {
  if (!req.session.AuthCookie) {
    res.redirect("/");
  }
  const user = req.session.user
  try {
    const testreview = await reviewsData.getReviewId(req.params.reviewId)
    if (user.id != testreview.customersId) {
      res.status(400).render("reviews/error", { message: "You can't edit this review as you did not post it!" })
    }
    else {
      res.status(200).render('reviews/editreview', { id: testreview._id, testreview: testreview.reviewText })
    }
  } catch (error) {
    res.status(400).render("reviews/error", { message: error })
  }
})


//update a review
router.post('/reviews/updatereview/:reviewId', async (req, res) => {
  if (!req.session.AuthCookie) {
    res.redirect("/");
  }
  req.params.reviewId
  let RestInfo = req.body;
  RestInfo.reviewText = xss(RestInfo.reviewText)
  if (!req.params.reviewId) {
    res.status(400).render("reviews/error", { message: 'You must provide id' });
    return;
  }

  if (!RestInfo) {
    res.status(400).render("reviews/error", { message: 'You must provide data to update the review' });
    return;
  }

  if (!RestInfo.reviewText) {
    res.status(400).render("reviews/error", { message: 'You must provide a text to update' });
    return;
  }

  try {
    await reviewsData.getReviewId(req.params.reviewId);
  } catch (e) {
    res.status(400).render("reviews/error", { error: e })
    return;
  }
  try {
    const updateSal = await reviewsData.update(req.params.reviewId, RestInfo.reviewText);
    res.status(200).render("reviews/editreview", { message: "Updated your review successfully", updateSal: updateSal });
  } catch (e) {
    res.status(400).render("reviews/error", { message: e })
  }
});

//like a review
router.post('/like/:reviewId/:customersId', async function (req, res) {
  if (!req.session.AuthCookie) {
    res.redirect("/");
  }
  const ReviewId = req.body.reviewId.trim() //xss(req.body.reviewId.trim());
  const customersId = req.body.customersId.trim() //xss(req.body.customersId.trim());
  const parsedreviewId = ObjectId(ReviewId);
  const parsedcustomersId = ObjectId(customersId);
  const review = await reviewsData.getReviewById(ReviewId);
  const update = await reviewsData.updateReviewLike(ReviewId, customersId, 1)//(review.likes.includes(customersId))? null : true);
  const updatedRev = await reviewsData.getReviewId(ReviewId);

  res.status(200).json({
    Upvoted: updatedRev.upvote.length.toString(),
    //dislikeNum: updatedRev.downvote.length.toString(),
    success: true
  });
})

//dislike a review
router.post('/dislike/:reviewId/:customersId', async function (req, res) {
  if (!req.session.AuthCookie) {
    res.redirect("/");
  }
  const ReviewId = req.body.reviewId.trim()//xss(req.body.reviewId.trim());
  const customersId = req.body.customersId.trim() //xss(req.body.customersId.trim());
  const parsedreviewId = ObjectId(ReviewId);
  const parsedcustomersId = ObjectId(customersId);
  const review = await reviewsData.getReviewById(ReviewId);
  const update = await reviewsData.updateReviewLike(ReviewId, customersId, 0)//(review.dislikes.includes(customersId))? null : false);
  const updatedRev = await reviewsData.getReviewId(ReviewId);

  res.status(200).json({
    //likeNum: updatedRev.upvote.length.toString(),
    Downvoted: updatedRev.downvote.length.toString(),
    success: true
  });
})

module.exports = router;