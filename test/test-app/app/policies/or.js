'use strict';

var asyncjs = require('async');

module.exports = function() {
    var policies = Array.prototype.slice.call(arguments);
    return function(req, res, next) {
        var fakeRes = {
            json: function() {},
            status: function() {
                return {
                    send: function() {}
                };
            }
        };

        asyncjs.some(policies, function(policy, fn) {
            policy(req, fakeRes, function(err) {
                fn(err === null);
            });
        }, function(ok) {
            if (!ok) {
                return res.json(403, {error: 'all policies failed'});
            }
            next();
        });
    };
};
