const { ObjectId } = require("mongodb");
//const { customers } = require(".");

const mongoCollections = require("../config/mongoCollections");
const comments = mongoCollections.comments;
const reviews = mongoCollections.reviews;
const customers = mongoCollections.customers;

module.exports = {
	async addComment(customerId, reviewId, commentText) {
		console.log(customerId, reviewId, commentText);
		if (!customerId || typeof customerId != "string")
			throw "customerId must be given as a string";
		if (!reviewId || typeof reviewId != "string")
			throw "reviewId must be given as a string";
		if (!commentText || typeof commentText != "string")
			throw "must give comment text as a string";
		const commentCollection = await comments();
		let newComment = {
			customerId: customerId,
			reviewId: reviewId,
			commentText: commentText,
		};
		const insertInfo = await commentCollection.insertOne(newComment);
		const revCollection = await reviews();

		if (insertInfo.insertedCount === 0) {
			throw "Could not add new comment";
		}
		let parsedId2 = ObjectId(reviewId);
		const newId = insertInfo.insertedId;
		const finComment = await this.getComment(newId.toString());
		const updatedInfo = await revCollection.updateOne(
			{ _id: parsedId2 },
			{ $push: { comments: newComment._id, commentTexts: newComment.commentText } }
		);
		if (updatedInfo.modifiedCount === 0) {
			throw "Could not update Review Collection with Review Data!";
		}
		let parsedId = ObjectId(customerId);
		const customerCollection = await customers();
		const newId2 = insertInfo.insertedId;
		//const finComment2 = await this.getComment(newId2.toString());
		const updatedInfo2 = await customerCollection.updateOne(
			{ _id: parsedId },
			{ $push: { commentIds: newComment._id } }
		);
		//const newId = insertInfo.insertedId;
		//const newIDString = String(newId);
		//const recentComment = await this.getComment(newIDString);
		console.log(finComment);
		return finComment;
	},
	async getAllComments() {
		const commentCollection = await comments();
		const commentList = await commentCollection.find({}).toArray();
		if (commentList.length === 0) throw "no Comments in the collection";
		return commentList;
	},
	async getComment(id) {
		if (!id) throw "id must be given";
		let parsedId = ObjectId(id);
		const commentCollection = await comments();
		const comment = await commentCollection.findOne({ _id: parsedId });
		if (!comment) throw "Comment with that id does not exist";
		return comment;
	},
	// Find all the comments of a specific customerId returns an array of comments
	async getCommentsForCustomer(customerId) {
		if (!customerId || typeof customerId !== "string")
			throw "customerId is invalid";
		let parsedId = ObjectId(customerId);
		const customerCollection = await customers();
		const customer = await customerCollection.findOne({ _id: parsedId });
		//console.log(customer);
		let commentIdsarray = [];
		for (i in customer.commentIds) {
			commentIdsarray[i] = customer.commentIds[i];
		}
		//console.log(commentIdsarray);
		let commentsForCustomers = [];
		for (i in commentIdsarray) {
			commentsForCustomers[i] = await this.getComment(commentIdsarray[i]);
		}
		let finalComments = [];
		for (i in commentsForCustomers) {
			finalComments = commentsForCustomers[i].commentText;
		}
		console.log(finalComments);
		return finalComments;
	},
	// Find all the comments of a specific reviewId returns an array of comments
	async getCommentsForReview(reviewId) {
		if (!reviewId || typeof reviewId !== "string") throw "reviewId is invalid";
		let parsedId = ObjectId(reviewId);
		const revCollection = await reviews();
		console.log(reviewCollection);
		const review = await revCollection.findOne({ _id: parsedId });
		//console.log(customer);
		let comments = [];
		for (i in customer.commentIds) {
			commentIdsarray[i] = customer.commentIds[i];
		}
		//console.log(commentIdsarray);
		let commentsForCustomers = [];
		for (i in commentIdsarray) {
			commentsForCustomers[i] = await this.getComment(commentIdsarray[i]);
		}
		let finalComments = [];
		for (i in commentsForCustomers) {
			finalComments = commentsForCustomers[i].commentText;
		}
		return finalComments;

	},
	//comments for a user
	//comments for a reviews
	async removeComment(id) {
		id = id.toString();

		if (!id || typeof id != "string") throw "id must be given as a string";
		const commentCollection = await comments();
		let comment = await this.getComment(id);

		const deleteInfo = await commentCollection.deleteOne({ _id: ObjectId(id) });
		if (deleteInfo.deletedCount === 0) {
			throw `could not delete comment with id of ${id}`;
		}
		try {
			const reviewCollection = await reviews();
			const objreviewId = ObjectId(comment.reviewId);
			const deletionInfoForCommentFromReview = await reviewCollection.updateOne(
				{ _id: objreviewId },
				{ $pull: { comments: String(id) } }
			);
			if (deletionInfoForCommentFromReview.deletedCount === 0) {
				throw `Could not delete Comment with id of ${id}`;
			}
		} catch (e) {
			throw "Could not Delete Comment from Review while Deleting Comment!";
		}
		try {
			const customerCollection = await customers();
			const objcustomerId = ObjectId(comment.customerId);
			const deletionInfoForCommentFromCustomer =
				await customerCollection.updateOne(
					{ _id: objcustomerId },
					{ $pull: { commentIds: id } }
				);
			if (deletionInfoForCommentFromCustomer.deletedCount === 0) {
				throw `Could not delete Comment wiht id of ${id}`;
			}
		} catch (e) {
			throw "Could not Delete commentid fro customer while deleting Comment!";
		}
		return true;
	},
	async updateComment(id, commentText) {
		//Not working properly and showing comment id is invalid
		id = id.toString();
		if (!id || typeof id !== "string") throw "CommentID is invalid";
		if (!commentText || typeof commentText !== "string")
			throw "The text of the comment is invalid";
		const updatedCommentData = {};
		if (!commentText) {
			throw "Please Enter a Comment";
		} else {
			updatedCommentData.commentText = commentText;
		}

		if (typeof id === "string") id = ObjectId(id);
		const commentCollection = await comments();
		const updateCommentInfo = await commentCollection.updateOne(
			{ _id: id },
			{ $set: updatedCommentData }
		);
		const revCollection = await reviews();
		//const finComment2 = await this.getComment(newId2.toString());
		let comment = await this.getComment(id);
		let parsedId2 = ObjectId(comment.reviewId);
		const updatedInfo = await revCollection.updateOne(
			{ _id: parsedId2 },
			{ $push: { comments: updatedCommentData.commentText } }
		);
		if (updatedInfo.modifiedCount === 0) {
			throw "Could not update Review Collection with Review Data!";
		}
		let parsedId = ObjectId(comment.customerId);
		const customerCollection = await customers();
		//const finComment2 = await this.getComment(newId2.toString());
		const updatedInfo2 = await customerCollection.updateOne(
			{ _id: parsedId },
			{ $push: { commentIds: id } }
		);
		if (updateCommentInfo.modifiedCount === 0) throw "Could not update comment";
		return await this.getComment(id);
	},
};