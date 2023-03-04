const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
var validator = require("email-validator");
dotenv = require('dotenv').config();

// import models of DB
const User = require('../models/User');
const useroleData = require('../data/userRole.json');

const expirationTime = new Date(Date.now() + 60*60*1000);


const RegisterUser = async (req, res) => {
    // read the username, password, email from the request body give code
    let { username, password, email, userrole } = req.body;

    // check whether all the fields are filled or not
    if (!username || !password || !email) {
        return res.status(400).send("Please fill all the required fields.");
    }

    if (!userrole) {
        userrole = "Customer";
    } else {
        // map the number to the role
        userrole = useroleData.find((item) => item.id == userrole).name;
    }


    // validate the email by library
    const isvalidEmail = validator.validate(email);
    if (!isvalidEmail) {
        return res.status(400).send("Please enter a valid email.");
    }

    // check whether the username and email is already existed or not
    const existingUser = await User.findOne({username});
    if (existingUser) {
        return res.status(409).send({
            "message":"Username already exists."
        });
    }
    const existingUserEmail = await User.findOne({email});
    if (existingUserEmail) {
        return res.status(409).send({
            "message":"Email already exists."
        });
    };
    
    // if the username is not existed then generate the hash value of the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // create the user object
   
    const user = new User({ username, password: hashedPassword, email, role : userrole });

    // save the user object into the mongodb database'
    try{
        const savedUser = await user.save();
        console.log(`User ${savedUser.username} saved to database.`);

         // Generate a JWT token for the user
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        // Set the JWT token as a cookie
        res.cookie('token', token, {
            httpOnly: true,
            secure: true,
            expires: expirationTime,
        });

        savedUser.password = undefined;
        res.status(200).send({
            "message":"User registered successfully.",
            "user": savedUser,
        });

    } catch(err){
        console.log(err);
        res.status(500).send({
            "message":"Error saving user to database.",
            "error": err
        });
    }

};

// make a api for login user
const LoginUser = async (req, res) => {
    // read the username, password from the request body give code
    const { email, password } = req.body;

    // check whether all the fields are filled or not
    if (!email || !password) {
        return res.status(400).send({
            "message":"Please fill all the fields."
        });
    }

    // check whether is existed or not
    try{
        const existingUserEmail = await User.findOne({email});
        if (!existingUserEmail) {
            return res.status(409).send({
                "message":"Invalid credentials in email."
            });
        };

        // check whether the password is correct or not
        const isPasswordCorrect = await bcrypt.compare(password, existingUserEmail.password);
        if (!isPasswordCorrect) {
            return res.status(400).send({
                "message":"Invalid credentials in password."
            });
        }
        
        // Generate a JWT token for the user
        const token = jwt.sign({ userId: existingUserEmail._id }, process.env.JWT_SECRET);

        // Set the JWT token as a cookie
        res.cookie('token', token, {
            httpOnly: true,
            secure: true,
            expires: expirationTime,
        });

        existingUserEmail.password = undefined;
        res.status(200).send({
            "message":"User logged in successfully.",
            "user": existingUserEmail,
        });
    } catch(err){
        console.log(err);
        res.status(500).send({
            "message":"Server error! Try again later.",
            "error": err
        });
    };

};


// export both the functions
module.exports = {
    RegisterUser,
    LoginUser
};