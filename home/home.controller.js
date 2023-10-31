const express = require('express');
const router = express.Router();
const db = require('_helpers/db');
const asyncHandler = require('express-async-handler');
const moment = require('moment');
const { Op } = require("sequelize");
const sequelize = require("sequelize");
const dayjs = require('dayjs')

//import Todo from '../todo/model'


const GetUpcomingGames = asyncHandler(async(req, res) => {

    const id = "211";

    let today = moment().format(); 

    console.log(today)
    const query = { CloseTime: { $gt: today}, include: ["universities"]  };    

    
    let contact1 = await db.Forum.findAll({where: { CloseTime: { [Op.gt]: today }}, include: [
        {
            model: db.University,
            required : true,
            as: 'universities'
        },
        {
            model: db.Post,
            required : true,
            as: 'posts',
            where: {
                [Op.and]: [{ SoftDeleted: '0' }, { ListingFrozen: '0' }], 
              }
        },
        
    ]});

    
    // contact1.map(item => console.log('item1: '+{item}))
    // data: contact1.map((contact1) => ({
           
    // }))

    //const now = new Date();

//console.log(now);

    // const fieldMapper = {
    //     Title: "title_name",
    //     CoverImageUrl: 'image'
    // }
    var text = "[^a-zA-Z0-9_.]+";

    contact1 = await Promise.all(contact1.map(async (contact1) => {
        
        let TrustapTransactions = await db.TrustapTransaction.findOne({

            order: [
                ['Id', 'DESC'],
            ],

            where: {
                [Op.and]: [{ ForumId: contact1.Id }],
                [Op.or]: [{ Status: 'seller_handover_confirmed' }, { Status: 'funds_released' }], 
              }
        });

        let TotalSoldTrustapTransactions = await db.TrustapTransaction.findAll({
            where: {
                [Op.and]: [{ ForumId: contact1.Id }],
                [Op.or]: [{ Status: 'seller_handover_confirmed' }, { Status: 'buyer_handover_confirmed' }, { Status: 'funds_released' }], 
              }
        });

        let Posts = await db.Post.findAll({
            where: {
                [Op.and]: [{ ForumId: contact1.Id }, { SoftDeleted: '0' }, { ListingFrozen: '0' }],
              }
        });

        PostLowestPrice = await db.Post.findAll({
            where: {
                [Op.and]: [{ ForumId: contact1.Id }, { SoftDeleted: '0' }, { ListingFrozen: '0' }],
              },
              attributes: [
                [sequelize.fn('min', sequelize.col('Price')), 'Price'],
              ],
        });
        
        


        return {
            ForumId: contact1.Id,
            OnClickCode: "/" + contact1.universities.SeoName + "/" + contact1.universities.SeoName + "-" + text.replace(contact1.Title, "") + "-tickets?id=" + contact1.Id, 
            AwayTeam: contact1.Title,
            HomeTeam: (contact1.Title != "Season Package") ? contact1.universities.GameName + " vs. " : contact1.universities.GameName,
            LastSale : TrustapTransactions?.Price,
            TotalSold : TotalSoldTrustapTransactions?.length,
            LowestPrice : PostLowestPrice[0].Price,
            Sport : contact1.Sport,
            SeatingAssignments : contact1.SeatingAssignment,
            TotalListed : Posts.length,
            ImageSrc : contact1.CoverImageUrl,
            GameDate : dayjs(contact1.CloseTime).subtract(5, 'hour').format('MMMM D'),
            CloseTime: contact1.CloseTime }
        })) 

    res.status(200).json(contact1);
});

const getFaqs = asyncHandler(async(req, res) => {

    function FaqFunction(question, answer){
        this.question = question;
        this.answer = answer
    }
    
    var Faq = [];
    Faq.push(new FaqFunction('Is Student Seats legit?','Absolutely, we are! Student Seats was founded in Alabama by two alumni of the University of Alabama in 2020. We are partnered with Trustap, a reliable escrow transaction system, to offer a\r\nsafe and secure marketplace for college students to transfer their student tickets without any worries. Our initiative has been recognized and featured in student newspapers at universities\r\nincluding Alabama, Michigan, and Wisconsin, affirming our legitimacy and dedication to facilitating a safe space for ticket transfers.','General'));

    Faq.push(new FaqFunction('Is Student Seats legit?','<ol><li>Make sure that you have added your personal details + bank account information to your Trustap account so we know where to send your funds!</li><li>Await payment from the buyer.</li><li>Send your ticket to the buyer through your schools ticket transfer portal.</li><li>Return to Student Seats, navigate to My Tickets &gt; Your Active Listings and click "I Sent My Ticket".</li><li>Wait for the email (from your school) stating that the buyer has accepted the pending ticket transfer.</li><li>After the buyer accepts the transfer and the transfer is no longer pending, click "Confirm Transfer" on the My Tickets &gt; Your Active Listings page on Student Seats.</li><li>Once successful, a 24 hour complaint period will start for the buyer. If there are no complaints, your money will be released automatically to your bank account at the end of the 24 hour hold.</li></ol>','Seller'));

     const faqs = await db.Faq.findAll(); 
    res.status(200).json(faqs);
});

const getUniverities = asyncHandler(async(req, res) => {
     const universities = await db.University.findAll();
     
     getuniversities = await Promise.all(universities.map(async (universities) => {
        
        return {
            Id: universities.Id,
            Name: universities.GameName,
            Image : universities?.ImageUrl}
        }));

    res.status(200).json(getuniversities);
});

const getReviews = asyncHandler(async(req, res) => {

    const reviews = await db.Review.findAll({include: [
        {
            model: db.User,
            required : true,
            as: 'users'
        }]});

    getreviews = await Promise.all(reviews.map(async (reviews) => {
        
            return {
                Id: reviews.Id,
                userName : reviews?.users.NormalizedUserName,
                Review: reviews.review,}

            }));
    res.status(200).json(getreviews);
});

const GetTopBuyers = asyncHandler(async(req, res) => {

    
    
    let Buyers = await db.User.findAll({
        include: [
            {
                model: db.TrustapTransaction,
                required: true,
                as: 'trustaptransactions_users_buyers',
                where: {
                    [Op.or]: [{ Status: 'seller_handover_confirmed' }, { Status: 'buyer_handover_confirmed' }, { Status: 'funds_released' }],
                },
            },
            {
                model: db.University,
                required: true,
                as: 'users_university'
            },
        ]});

    

        const GetTopBuyers = await Promise.all(Buyers.map(async (Buyers) => {
        
            let counter = 0;
                for (let i = 0; i < Buyers.trustaptransactions_users_buyers.length; i++) {
                     counter++;
                }
            return {
                Id: Buyers.Id,
                Name: Buyers.UserName,
                GameName: Buyers.users_university.GameName,
                MemberSince : Buyers.MemberSince,
                PurchasesCount : counter,
                Rating : Buyers.Rating,
                ProfileImageUrl : Buyers.ProfileImageUrl,
                SchoolImageUrl : Buyers.users_university.ImageUrl
            }
           }));    

    res.status(200).json(GetTopBuyers);
});


const GetTopSellers = asyncHandler(async(req, res) => {

    
    
    let Sellers = await db.User.findAll({
        include: [
            {
                model: db.TrustapTransaction,
                required: true,
                as: 'trustaptransactions_users_sellers',
                where: {
                    [Op.or]: [{ Status: 'seller_handover_confirmed' }, { Status: 'buyer_handover_confirmed' }, { Status: 'funds_released' }],
                },
            },
            {
                model: db.University,
                required: true,
                as: 'users_university'
            },
        ]});

    

        const GetTopSellers = await Promise.all(Sellers.map(async (Sellers) => {
        
            let counter = 0;
                for (let i = 0; i < Sellers.trustaptransactions_users_sellers.length; i++) {
                     counter++;
                }
            return {
                Id: Sellers.Id,
                Name: Sellers.UserName,
                GameName: Sellers.users_university.GameName,
                MemberSince : Sellers.MemberSince,
                SalesCount : counter,
                Rating : Sellers.Rating,
                ProfileImageUrl : Sellers.ProfileImageUrl,
                SchoolImageUrl : Sellers.users_university.ImageUrl
            }
           }));    

    res.status(200).json(GetTopSellers);
});

module.exports = {GetUpcomingGames, getFaqs, getUniverities, getReviews, GetTopBuyers, GetTopSellers}