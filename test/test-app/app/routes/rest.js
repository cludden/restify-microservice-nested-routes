'use strict';

module.exports = function(microservice) {
    return {
        get: 'rest.query',
        post: 'rest.create',
        '/:id': {
            del: 'rest.remove',
            get: 'rest.detail',
            put: 'rest.update'
        }
    };
};
