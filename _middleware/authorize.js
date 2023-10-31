const jwt = require('express-jwt');
const jwtwebtoken = require("jsonwebtoken");
const { secret } = require('config.json');
const db = require('_helpers/db');

module.exports = authorize;

function authorize() {
    return [
        // authenticate JWT token and attach decoded token to request as req.user
        

        jwt({ secret, algorithms: ['HS256'] }),
       
        // attach full user record to request object
        async (req, res, next) => {
            console.log("secret",secret);

            const authheader = req.headers.authorization;
    console.log(req.headers);

    if (authheader) {
        const bearer = authheader.split(' ');
        const bearerToken = bearer[1];
        req.token = bearerToken;
        console.log("req.token>>>",req.token);
       // next();

       jwtwebtoken.verify(req.token,
    secret,
    (err, decoded) => {
     if (err) {
       return res.status(401).send({
         message: "Unauthorized!",
       });
     }
     console.log("decoded>>",decoded)
     req.user.sub = decoded.email;
    });

      }



            // get user with id from token 'sub' (subject) property
            const user = await db.User.findOne({where: {email: req.user.sub}});

            // check user still exists
            if (!user)
                return res.status(401).json({ message: 'Unauthorized User' });

            // authorization successful
            req.user = user.get();
            next();
        }
    ];

    
}