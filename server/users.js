var MongoClient = require('mongodb').MongoClient,
    assert = require('assert');

module.exports = function(app) {
    'use strict';

    return {
        // Connection URL 
        url: 'mongodb://localhost:27017/',
        instance: {},
        collections: {},
        create: function() {
            // Use connect method to connect to the Server 
            MongoClient.connect(this.url, function(err, db) {
                app.users.instance = db;
                app.users.collections.users = app.users.instance.collection('users');

                // app.users.deleteUsers(function(data) {
                // });
            });
        },

        registerUser: function(user, callback) {
            this.collections.users.findOne({ facebookId: user.facebookId }, function(err, result) {
                if (result !== null) {
                    callback('exist');
                } else {
                    app.users.collections.users.insert(
                        user,
                        function(err, result) {
                            callback(result);
                        });
                }
            });

        },
        deleteUsers: function(callback) {
            this.collections.users.remove({});
            callback();
        }
    }
}
