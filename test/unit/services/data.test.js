'use strict';

var asyncjs = require('async'),
    chai = require('chai'),
    expect = chai.expect,
    _ = require('lodash');

describe('[service] data', function() {
    describe('#create', function() {
        it('should create a new group', function(done) {
            asyncjs.waterfall([
                function createPermission(fn) {
                    microservice.services['data'].create('permissions', {
                        id: 5,
                        type: 'test',
                        resource: 'test',
                        data: {
                            name: 'test'
                        }
                    }, function(err, permission) {
                        expect(err).to.not.exist;
                        expect(permission).to.be.an('object');
                        expect(permission.type).to.equal('test');
                        fn(err);
                    });
                },

                function countPermissions(fn) {
                    microservice.services['data'].find('permissions', {}, function(err, permissions) {
                        expect(err).to.not.exist;
                        expect(permissions).to.have.lengthOf(5);
                        fn(err);
                    });
                },

                function destroyPermission(fn) {
                    microservice.services['data'].remove('permissions', 5, fn);
                }
            ], done);
        });
    });

    describe('#detail', function() {
        it('should find the correct user', function(done) {
            microservice.services['data'].detail('users', 3, function(err, user) {
                expect(err).to.not.exist;
                expect(user).to.be.an('object');
                expect(user.email).to.equal('hclinton@email.com');
                done();
            });
        });
    });

    describe('#find', function() {
        it('should return all permissions', function(done) {
            microservice.services['data'].find('permissions', {}, function(err, permissions) {
                expect(err).to.not.exist;
                expect(permissions).to.be.an('array');
                expect(permissions).to.have.lengthOf(4);
                expect(_.pluck(permissions, 'type')).to.eql(['ability', 'ability', 'cache', 'cache']);
                done();
            });
        });

        it('should return all users', function(done) {
            microservice.services['data'].find('users', {}, function(err, users) {
                expect(err).to.not.exist;
                expect(users).to.be.an('array');
                expect(users).to.have.lengthOf(3);
                expect(_.pluck(users, 'email')).to.eql(['jsmith@email.com', 'ttebow@email.com', 'hclinton@email.com']);
                done();
            });
        });

        it('should return all groups', function(done) {
            microservice.services['data'].find('groups', {}, function(err, groups) {
                expect(err).to.not.exist;
                expect(groups).to.be.an('array');
                expect(groups).to.have.lengthOf(2);
                expect(_.pluck(groups, 'name')).to.eql(['admins', 'all users']);
                done();
            });
        });
    });

    describe('#remove', function() {
        it('should remove the correct user', function(done) {
            asyncjs.waterfall([
                function createUser(fn) {
                    microservice.services['data'].create('users', {
                        id: 4,
                        first: 'tom',
                        last: 'cruise',
                        email: 'tcruise@email.com'
                    }, function(err, user) {
                        expect(err).to.not.exist;
                        expect(user).to.be.an('object');
                        fn(err);
                    });
                },

                function countUsers(fn) {
                    microservice.services['data'].find('users', {}, function(err, users) {
                        expect(err).to.not.exist;
                        expect(users).to.have.lengthOf(4);
                        fn(err);
                    });
                },

                function destroyUser(fn) {
                    microservice.services['data'].remove('permissions', 5, fn);
                },

                function countUsersAgain(fn) {
                    microservice.services['data'].find('users', {}, function(err, users) {
                        expect(err).to.not.exist;
                        expect(users).to.have.lengthOf(4);
                        fn(err);
                    });
                }
            ], done);
        });
    });

    describe('#update', function() {
        it('should update the correct user', function(done) {
            asyncjs.auto({
                original: function findOriginalUser(fn) {
                    microservice.services['data'].detail('users', 3, fn);
                },

                update: ['original', function updateUser(fn, r) {
                    microservice.services['data'].update('users', 3, {
                        first: 'bill',
                        email: 'bclinton@email.com'
                    }, function(err, updated) {
                        expect(err).to.not.exist;
                        expect(updated).to.be.an('object');
                        expect(updated.first).to.equal('bill');
                        fn(err);
                    });
                }],

                check: ['update', function verifyUpdate(fn) {
                    microservice.services['data'].detail('users', 3, function(err, user) {
                        expect(err).to.not.exist;
                        expect(user.id).to.equal(3);
                        expect(user.first).to.equal('bill');
                        expect(user.last).to.equal('clinton');
                        expect(user.email).to.equal('bclinton@email.com');
                        fn(err);
                    });
                }],

                replace: ['check', function(fn, r) {
                    microservice.services['data'].update('users', 3, r.original, fn);
                }]
            }, done);
        });
    });
});
