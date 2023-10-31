const express = require("express");

const {GetUpcomingGames} = require("home/home.controller")

const router = express.Router();

console.log("you are in routes")

router.route("/hello").get(GetUpcomingGames);

module.exports = router;