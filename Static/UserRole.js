
const useroleData = require('../data/userRole.json')

//serve this file as get to the client write the production ready code
const getUserRole = async (req, res) => {
    try {
        res.status(200).send({
            "message":"User role fetched successfully.",
            "date":useroleData
        });
    } catch (err) {
        console.log(err);
        res.status(500).send({
            "message": "Server error! Try again later.",
            "error": err
        });
    }
};

//export the function
module.exports = {
    getUserRole
};
