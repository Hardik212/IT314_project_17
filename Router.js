const express = require('express');
const router = express.Router();

// import controller functions
const {
    RegisterUser,
    LoginUser
} = require('./auth/Register');

// import static controller functions
const { getUserRole } = require('./Static/UserRole');


// define routes for authentication
router.post('/auth/register', RegisterUser);
router.post('/auth/login', LoginUser);

// default route for invalid routes
router.post('*', (req, res) => {
    res.status(404).send({
        "message": "Invalid route."
    });
});

// static apis
router.get('/', (req, res) => {
    res.send('Welcome to the server');
});
router.get('/userrole',getUserRole);

// static route for invalid routes
router.get('*', (req, res) => {
    res.status(404).send({
        "message": "Invalid route."
    });
});

module.exports = router;
