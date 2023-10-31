const express = require('express');
const router = express.Router();
const db = require('_helpers/db');
const asyncHandler = require('express-async-handler');

const GetUpcomingGames = asyncHandler(async(req, res) => {
    console.log("happy")
    //const contacts = await db.Forum.find();
    
    //var contact1;

    //const contacts = await db.Forum.findOne({ id: 'hello' });

    const contact1 = db.Univerity.findAll({
        include: ["forums"],
      });


    res.status(200).json(contact1);
});

module.exports = {GetUpcomingGames}