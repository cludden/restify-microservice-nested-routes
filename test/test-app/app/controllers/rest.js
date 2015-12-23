'use strict';

module.exports = {
    create: function(req, res) {
        var model = req.options.model;
        req.microservice.services['data'].create(model, req.body, function(err, record) {
            if (err) {
                return res.json(500, {error: err});
            }
            res.json(200, record);
        });
    },

    detail: function(req, res) {
        var model = req.options.model;
        req.microservice.services['data'].detail(model, req.params.id, function(err, record) {
            if (err) {
                return res.json(500, {error: err});
            }
            res.json(200, record);
        });
    },

    find: function(req, res) {
        var model = req.options.model;
        req.microservice.services['data'].detail(model, req.query, function(err, records) {
            if (err) {
                return res.json(500, {error: err});
            }
            res.json(200, records);
        });
    },

    remove: function(req, res) {
        var model = req.options.model;
        req.microservice.services['data'].remove(model, req.params.id, function(err, removed) {
            if (err) {
                return res.json(500, {error: err});
            }
            res.json(200, removed);
        });
    },

    update: function(req, res) {
        var model = req.options.model;
        req.microservice.services['data'].update(model, req.params.id, function(err, updated) {
            if (err) {
                return res.json(500, {error: err});
            }
            res.json(200, updated);
        });
    }
};
