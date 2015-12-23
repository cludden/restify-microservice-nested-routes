'use strict';

var chai = require('chai'),
    expect = chai.expect,
    sinonChai = require('sinon-chai');

chai.use(sinonChai);

describe('basic tests', function() {
    before(function() {
        process.chdir(__dirname + '/test-app');
    });

    it('should start without error', function(done) {
        var Microservice = require('restify-microservice'),
            microservice = new Microservice();
        global['microservice'] = microservice;

        microservice.start(function(err) {
            expect(err).to.not.exist;
            done(err);
        });
    });
});
