'use strict';

module.exports = function(microservice) {
    return {
        // define version for all paths
        'v1.0.0': {
            '/api': {
                // define `req.options` for path and sub-paths
                // these options will be available in policies and controllers at `req.options`
                options: {
                    desc: 'welcome to the api v1.0.0'
                },
                // define policies for path and sub-path
                policies: [
                    'authenticated' // authenticated policy (/app/policies/authenticated.js)
                ],
                // define sub-path
                '/admin': 'admin', // mount `admin` routes at this path (/app/routes/admin.js)
                '/groups': {
                    // `req.options` can be augmented at sub-paths
                    //      console.log(req.options) => {desc: 'welcome to the api v1.0.0', model: 'groups'}
                    options: {
                        model: 'groups'
                    },
                    // define additional policies to add to the policy chain for path and sub-paths
                    additionalPolicies: [
                        // policies can also be factory functions
                        microservice.policies['able-to']('manage', 'groups')
                    ],
                    // mount `rest` routes at this sub-path (/app/routes/rest.js)
                    routes: 'rest'
                },
                '/login': {
                    // define route (POST /api/login)
                    post: {
                        policies: [], // override the policy chain for this route
                        handler: 'auth.login' // define the handler (/app/controllers/auth.js#login)
                    }
                },
                '/logout': {
                    // define route (GET /api/logout)
                    get: 'auth.logout' // define the handler (/app/controllers/auth.js#logout)
                },
                '/permissions': {
                    options: {
                        model: 'permissions'
                    },
                    additionalPolicies: [
                        microservice.policies['member-of']('admins')
                    ],
                    // routes can be reused, while also changing the policy chain and request options
                    routes: 'rest'
                },
                '/say': {
                    '/hello/(\w+)': {
                        regex: true,
                        get: 'greet.hello'
                    },
                    '/goodbye/(\w+)': {
                        regex: true,
                        get: 'greet.goodbye'
                    }
                },
                '/users': {
                    options: {
                        model: 'users'
                    },
                    get: 'rest.find',
                    post: 'rest.create',
                    '/:id': {
                        // define route (DELETE /api/users/:id)
                        del: {
                            // define additional policies to add to the policy chain for this route
                            additionalPolicies: [
                                microservice.policies['member-of']('admins')
                            ],
                            handler: 'rest.remove'
                        },
                        get: {
                            additionalPolicies: [
                                microservice.policies['or'](
                                    microservice.policies['is-equal']('user.id', 'params.id'),
                                    microservice.policies['able-to']('manage', 'users')
                                )
                            ],
                            handler: 'rest.detail'
                        },
                        put: {
                            additionalPolicies: [
                                microservice.policies['or'](
                                    microservice.policies['if'](
                                        microservice.policies['is-equal']('user.id', 'params.id'),
                                        microservice.policies['blacklist']('email', 'last', 'mobile')
                                    ),
                                    microservice.policies['if'](
                                        microservice.policies['able-to']('manage', 'users'),
                                        microservice.policies['blacklist']('id', {reset: true})
                                    )
                                )
                            ],
                            handler: 'rest.update'
                        }
                    }
                }
            },
            '/healthy': {
                // route handlers can be defined inline (policies too!)
                get: function(req, res) {
                    req.microservice.log('silly', 'healthy called');
                    res.status(200);
                    res.send();
                }
            }
        },
        // mount `v2/routes` at a new version (/app/routes/v2/routes.js)
        'v2.0.0': 'v2/routes'
    };
};
