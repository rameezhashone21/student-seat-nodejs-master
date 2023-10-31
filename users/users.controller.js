const express = require('express');
const router = express.Router();
const Joi = require('joi');

console.log("hello3")

const validateRequest = require('_middleware/validate-request');
const authorize = require('_middleware/authorize')
const userService = require('./user.service');

// routes
router.post('/authenticate', authenticateSchema, authenticate);
router.post('/register', registerSchema, register);
router.get('/', authorize(), getAll);
router.get('/getAllNew', getAllNew);
router.get('/getCurrentUser', authorize(), getCurrent);
router.get('/:id', authorize(), getById);
router.put('/updateUser/:id', authorize(), updateSchema, update);
router.delete('/:id', authorize(), _delete);

module.exports = router;

function authenticateSchema(req, res, next) {

    const schema = Joi.object({
        email: Joi.string().required(),
        password: Joi.string().required()
    });
    validateRequest(req, next, schema);
}

function authenticate(req, res, next) {
    console.log("happy")

    userService.authenticate(req.body)
        .then(user => res.json(user))
        .catch(next);
}

function registerSchema(req, res, next) {
    const schema = Joi.object({
        // Id: Joi.string().required(),
        FirstName: Joi.string().required(),
        LastName: Joi.string().required(),
        Email: Joi.string().email({ tlds: { allow: false } }).required(),
        UserName: Joi.string().required(),
        password: Joi.string().min(6).required()
        //PhoneNumber: Joi.
    });
    validateRequest(req, next, schema);
}

function register(req, res, next) {
    userService.create(res,req.body)
        .then(() => res.json({ message: 'Registration successful' }))
        .catch(next);
}

function getAll(req, res, next) {
    console.log("inside getAll");
    userService.getAll()
        .then(users => res.json(users))
        .catch(next);
}

function getAllNew(req, res) {
    console.log("inside getAll");
    userService.getAll()
        .then(users => res.json(users))
}


function getCurrent(req, res, next) {
    console.log('Sdsda')
    res.json(req.user);
}

function getById(req, res, next) {
    userService.getById(req.params.id)
        .then(user => res.json(user))
        .catch(next);
}

function updateSchema(req, res, next) {
    const schema = Joi.object({
        firstName: Joi.string().empty(''),
        lastName: Joi.string().empty(''),
        username: Joi.string().empty(''),
        password: Joi.string().min(6).empty('')
    });
    validateRequest(req, next, schema);
}

function update(req, res, next) {
    userService.update(req.params.id, req.body)
        .then(user => res.json(user))
        .catch(next);
}

function _delete(req, res, next) {
    userService.delete(req.params.id)
        .then(() => res.json({ message: 'User deleted successfully' }))
        .catch(next);
}