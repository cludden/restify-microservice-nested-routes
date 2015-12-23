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

    var definition;
    try {
        definition = require(process.cwd() + '/app/routes');
        if (_.isFunction(definition)) definition = definition(microservice);
    } catch (err) {
        microservice.log('info', '[Routes] no routes found');
    }

    var routes = include({
        dirname:  process.cwd() + '/app/routes',
        filter:  /(.+)\.js$/,
        excludeDirs:  /^\.(git|svn)$/,
        keepDirectoryPath: true,
        flattenDirectories: true,
        optional:  true
    });

    var defaultVersion = microservice._config.server.version || '1.0.0';
    bindRoutes({
        definition: definition,
        microservice: microservice,
        routes: routes,
        version: defaultVersion
    });

    cb();
};

function bindRoutes(options) {
    var defaultPolicies = options.defaultPolicies || [],
        defaultOptions = options.defaultOptions || {},
        definition = options.defintion,
        microservice = options.microservice,
        rootPath = options.path || '',
        routes = options.routes || {},
        version = options.version || '1.0.0';

    // allow default policy chain to be overridden at any depth
    defaultPolicies = definition.policies || defaultPolicies;

    // allow additional policies to be added to the policy chain
    if (definition.additionalPolicies && definition.additionalPolicies.length) {
        defaultPolicies = defaultPolicies.concat(definition.additionalPolicies);
    }

    // allow default request options to be overridden at any depth
    defaultOptions = definition.options || defaultOptions;

    // allow additional request options to be added
    if (definition.additionalOptions && _.isObject(definition.additionalOptions)) {
        _.extend(defaultOptions, definition.defaultOptions);
    }

    // add request options to the middleware chain
    defaultPolicies.unshift(function(req, res, next) {
        req.options = req.options || {};
        _.extend(req.options, defaultOptions);
        next();
    });

    _.keys(definition).forEach(function(key) {
        var keyDefinition = definition[key];

        // check for restify verbs first
        if (supportedMethods.indexOf(key) !== -1) {
            var handler;

            // handle string definition
            if (_.isString(keyDefinition)) {
                // assume the string represents controller.action
                var pieces = keyDefinition.split('.');
            }
        }

        // get a reference to the key's definition
        keyDefinition = definition[key];
        if (_.isString(keyDefinition)) {
            // if the keyDefinition is a string, require it
            keyDefinition = routes[key];
            if (!keyDefinition) keyDefinition = {};
            if (_.isFunction(keyDefinition)) keyDefinition = keyDefinition(microservice);
        }

        // if key is a semver version, bindRoutes
        var versionTest = /v{0,1}(\d+\.\d+\.\d+)/g.exec(key);
        if (versionTest) {
            bindRoutes({
                defaultPolicies: defaultPolicies,
                defaultOptions: defaultOptions,
                definition: keyDefinition,
                microservice: microservice,
                rootPath: rootPath,
                version: versionTest[1]
            });
        }
    });
}

function handleRoute() {

}

function handleSubPath() {

}
