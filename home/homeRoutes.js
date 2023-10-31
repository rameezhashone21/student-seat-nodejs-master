const express = require("express");

const {GetUpcomingGames, getFaqs, getUniverities, getReviews, GetTopBuyers, GetTopSellers} = require("home/home.controller")

const router = express.Router();

console.log("you are in routes")

router.route("/GetUpcomingGames").get(GetUpcomingGames);
router.route("/Getfaqs").get(getFaqs);
router.route("/getSupporters").get(getUniverities);
router.route("/getReviews").get(getReviews);
router.route("/GetTopBuyers").get(GetTopBuyers);
router.route("/GetTopSellers").get(GetTopSellers);

module.exports = router;