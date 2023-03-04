const express = require('express');
const router = express.Router();

// import controller functions
const {
    RegisterUser,
    LoginUser
} = require('./auth/Register');

const { UserProfile,UpadteProfile } = require('./auth/Profile');


// import static controller functions
const { getUserRole } = require('./Static/UserRole');



// define routes for authentication
router.post('/auth/register', RegisterUser);
router.post('/auth/login', LoginUser);
router.get('/auth/profile', UserProfile);
router.put('/updateProfile/:id', UpadteProfile);
// router.put('/auth/profile/editProfile', editProfile);

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
