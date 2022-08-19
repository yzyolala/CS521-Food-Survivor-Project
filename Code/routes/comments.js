const express = require("express");
const router = express.Router();
const data = require("../data/");
const comments = data.comments;
const customer = data.customers;


router.get("/:id", async (req, res) => {
	if (!req.params.id) {
		res.status(400).json({ error: "Error viewing the comment" });
		return;
	}
	try {
		const comment = await comments.getComment(req.params.id);
		res
			.status(200)
			.render("comments/comments", { commentText: comment.commentText });
	} catch (e) {
		res.status(404).json({ message: "Comment not found!" });
	}
});

router.get("/", async (req, res) => {
	try {
		const commentList = await comments.getAllComments();
		res.status(200).json(commentList);
	} catch (e) {
		res.status(404).send();
	}
});

router.post("/add/:reviewId", async (req, res) => {
	if (!req.session.AuthCookie) {
		res.redirect("/");
	}
	console.log(req.session);
	console.log("Kjhsfoiuhweo");
	const user = req.session.user.id;
	console.log(user, 'user.id');

	if (!req.params.reviewId) {
		res.status(400).json({ error: "You must Supply an ID to add comment to!" });
		return;
	}
	const commentVal = req.body.commentText;
	try {
		addCommentOnReview = await comments.addComment(
			user,
			req.params.reviewId,
			commentVal
		);
		const getComment = await comments.getComment(addCommentOnReview._id)
		console.log("getComment", getComment.commentText)
		if (addCommentOnReview) {
			res.render("comments/success", { userId: addCommentOnReview.user, text: getComment.commentText, message: "Sucessfully added comment", restaurantId: getComment.restaurantID });
		} else {
			console.log("Error from else");
			return res.status(404).send();
		}
	} catch (e) {
		console.log(e);
		res.status(500).json({ error: e });
	}
});

router.get("/:restaurantId/:commentId/delete", async (req, res) => {
	if (!req.params.commentId) {
		res.status(400).json({ error: "You must Supply an ID to delete" });
		return;
	}
	try {
		await comments.getComment(req.params.commentId);
	} catch (e) {
		res.status(404).json({ error: "Comment not found!" });
		return;
	}
	try {
		deleteCommentsFromReview = await comments.removeComment(
			req.params.commentId
		);
		if (deleteCommentsFromReview) {
			return res.redirect("/restaurants/" + req.params.restaurantId); //where to redirect
		} else {
			return res.status(404).send();
		}
	} catch (e) {
		res.status(500).json({ error: e });
	}
});

router.post("/:restaurantId/:commentId/edit", async (req, res) => {
	const data = req.body;
	const rating = data.rating;
	const commentVal = req.body.commentValue;
	let hasError = false;
	let error = [];

	try {
		const updatedComment = await comments.updateComment(
			req.params.commentId,
			commentVal
		);
		return res.redirect("/restaurants/" + req.params.restaurantId); //where to redirect
	} catch (e) {
		console.log(e);
		res.status(404).json({ message: "Could not update comment!" });
	}
});

module.exports = router;
