const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
var validator = require("email-validator");
dotenv = require('dotenv').config();
const profilePicData = require('../data/profilePic.json');   // doubt on this one

// import models of DB
const User = require('../models/User');

const UserProfile = async (req, res) => {

    // check if the cookie is expired or not
    const myCookie = req.cookies.myCookie;
    if (myCookie && myCookie.expires < Date.now()) {
        res.status(401).send({
            "message":"Session expired. Please login again."
        });
        // res.redirect('/auth/login');
    }

    let { username } = req.body;
    try {
        const currUserProfile = await User.findOne({username});
        res.status(200).send({
            "message":"User profile displayed successfully.",
            "data": currUserProfile
        });
        // res.redirect('profile', { currUserProfile }); // Pass currUserProfile to the view

    } catch(err){
        console.log(err);
        res.status(500).send({
            "message":"Error displaying user profile.",
            "error": err
        });
    }
};

const UpadteProfile = async (req, res) => {

    // check if the cookie is expired or not
    const myCookie = req.cookies.myCookie;
    if (myCookie && myCookie.expires < Date.now()) {
        res.status(401).send({
            "message":"Session expired. Please login again."
        });
        // res.redirect('/auth/login');
    }

    // read the user details from the request body give code
    const uID = req.params.id;
    const currUser = req.body;

    //validate the phone number
        if ( currUser.phone){
            if(isNaN(currUser.phone) || currUser.phone.length != 10) {
                return res.status(400).send("Please enter a valid phone number.");
            }
        }   

    // validate the email by library
    if(currUser.email){
        const isvalidEmail = validator.validate(currUser.email);
        if (!isvalidEmail) {
            return res.status(400).send("Please enter a valid email.");
        }    
    } 
    
    // encrypt the password if it is changed
    if(currUser.password){
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(currUser.password, salt);
        currUser.password = hashedPassword;
    }

    // update the user object into the database
    User.findByIdAndUpdate(uID,currUser, {new:true})
        .then((user) => {
            res.status(200).send({
                "message":"User profile Updated successfully.",
                "user": user,
            });
        })
        .catch((err) => {
            console.log(err);
            res.status(500).send({
                "message":"Error updating user profile.",
                "error": err
            });
        });
   
};

// export the functions
module.exports = {
    UserProfile,
    UpadteProfile
};
