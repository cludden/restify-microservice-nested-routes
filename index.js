'use strict';

var asyncjs = require('async'),
    include = require('include-all'),
    supportedMethods = ['del', 'get', 'head', 'post', 'put'],
    _ = require('lodash');

module.exports = function restify_microservice_nested_routes(cb) {
    return module.exports.hook.call(this, cb);
};

module.exports.hook = function(cb) {
    var microservice = this;
    cb();
};
