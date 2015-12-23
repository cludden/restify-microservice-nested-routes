'use strict';

var _ = require('lodash');

module.exports = function(a, b) {
    return function(req, res, next) {
        a = _.get(req, a);
        b = _.get(req, b);
        if (a !== b) {
            var e = a + ' does not equal ' + b;
            res.json(403, {error: e});
            return next(e);
        }
        next();
    };
};
