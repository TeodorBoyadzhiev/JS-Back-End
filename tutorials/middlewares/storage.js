const course = require('../services/course');

module.exports = () => (req, res, next) => {

    req.storage = {
        ...course
    };
    
    next();
};