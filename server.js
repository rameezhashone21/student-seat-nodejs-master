require('rootpath')();
const express = require('express');
const app = express();
const router = express.Router();
const cors = require('cors');

const errorHandler = require('_middleware/error-handler');

const {GetUpcomingGames} = require("home/home.controller")


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// api routes
//router.route("/").get(GetUpcomingGames);

app.get('/', (req, res) => {
    res.status(200).json({ message: 'Welcome to the Student Seats Home' });
})
app.get('/api', (req, res) => {
    res.status(200).json({ message: 'Welcome to the Student Seats Api' });
})

app.use('/api/users', require('./users/users.controller'));
app.use("/api/home", require("./home/homeRoutes"));

// global error handler
app.use(errorHandler);

// start server
const port = process.env.NODE_ENV === 'production' ? (process.env.PORT || 80) : 4242;
app.listen(port, () => console.log('Server listening on port ' + port));