'use strict';

module.exports = function(microservice) {
    return {
        '/': {
            additionalPolicies: [
                microservice.policies['member-of']('admins')
            ],
            '/cache': {
                '/clear': {
                    additionalPolicies: [
                        'cache/clear'
                    ],
                    handler: 'cache.clear'
                }
            },
            '/config': 'rest'
        }
    };
};
