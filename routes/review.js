const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const Review = require("../models/review.js");
const Listing = require("../listing.js");
const {isLoggedIn} = require("../middleware.js");
// Reviews
    router.post("/",isLoggedIn,
        wrapAsync(async(req,res) => {
     let listing = await Listing.findById(req.params.id);
     let newReview = new Review(req.body.review);
     listing.reviews.push(newReview);
     await newReview.save();
     await listing.save();
     let {id} = req.params;
     res.redirect(`/listings/${id}`);
    }));

//    Delete Review Route
   router.delete("/:reviewId",
    wrapAsync(async(req,res) => {
     let {id,reviewId} = req.params;
     await Listing.findByIdAndUpdate(id,{$pull: {reviews:reviewId}});
     await Review.findByIdAndDelete(reviewId);
     res.redirect(`/listings/${id}`);
    })
   );

   module.exports = router;
