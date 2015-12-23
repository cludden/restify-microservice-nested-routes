'use strict';

module.exports = function(req, res, next) {
    req.microservice.log('silly', '[policy] authenticated executed');
    next();
};
