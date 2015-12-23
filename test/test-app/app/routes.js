'use strict';

module.exports = function(microservice) {
    return {
        'v1.0.0': {
            '/api': {
                policies: [
                    'authenticated'
                ],
                '/admin': 'admins',
                '/groups': {
                    options: {
                        model: 'groups'
                    },
                    additionalPolicies: [
                        microservice.policies['able-to']('manage', 'groups')
                    ],
                    routes: 'rest'
                },
                '/login': {
                    post: {
                        policies: [],
                        handler: 'auth.login'
                    }
                },
                '/logout': {
                    get: 'auth.logout'
                },
                '/permissions': {
                    options: {
                        model: 'permissions'
                    },
                    additionalPolicies: [
                        microservice.policies['member-of']('admins')
                    ],
                    routes: 'rest'
                },
                '/users': {
                    options: {
                        model: 'users'
                    },
                    '/:id': {
                        del: {
                            additionalPolicies: [
                                microservice.policies['member-of']('admins')
                            ],
                            handler: 'rest.destroy'
                        },
                        get: {
                            additionalPolicies: [
                                microservice.policies['or'](
                                    microservice.policies['must-be-equal']('user.id', 'params.id'),
                                    microservice.policies['able-to']('manage', 'users')
                                )
                            ],
                            handler: 'rest.detail'
                        },
                        put: {
                            additionalPolicies: [
                                microservice.policies['or'](
                                    microservice.policies['if'](
                                        microservice.policies['must-be-equal']('user.id', 'params.id'),
                                        microservice.policies['blacklist']('email', 'last', 'mobile')
                                    ),
                                    microservice.policies['if'](
                                        microservice.policies['able-to']('manage', 'users'),
                                        microservice.policies['blacklist']
                                    )
                                )
                            ]
                        }
                    }
                }
            },
            '/healthy': {
                get: function(req, res) {
                    res.status(200).send();
                }
            }
        },
        'v2.0.0': {

        }
    };
};
