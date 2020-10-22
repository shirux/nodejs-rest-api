const User = require('../models').User;
const bcryptjs = require('bcryptjs');
const auth = require('basic-auth');

/**
 * Authenticate User middleware, taken from course examples at treehouse
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
const authenticateUser = async (req, res, next) => {
    let message = null;

    // Parse the user's credentials from the Authorization header.
    const credentials = auth(req);

    // If the user's credentials are available...
    if (credentials) {
        // Search for users
        const user = await User.findOne({ 
            where: { 
                emailAddress: credentials.name 
            }
        })

        // If user exists on database
        if (user) {
        // Compare credential
        const authenticated = bcryptjs
            .compareSync(credentials.pass, user.password);

        // If the passwords match...
        if (authenticated) {
            // If auth match, then save user on request
            req.currentUser = user;
        } else {
            message = `Authentication failure for username: ${user.username}`
        }
        } else {
        message = `User not found for username: ${user.username}`
        }
    } else {
        message = `Auth header not found`;
    }

    // If user authentication failed...
    if (message) {
        // Return a response with a 401 Unauthorized HTTP status code.
        res.status(401).json({message: 'Access Denied'});
    } else {
        next();
    }
};

module.exports = authenticateUser