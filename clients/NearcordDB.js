const { MongoClient } = require('mongodb');
const { nearcord } = require('../config.json');

const UserClient = new MongoClient(nearcord);
const UserDb = UserClient.db('nearcord');
const NearcordUsers = UserDb.collection('users');

module.exports = { NearcordUsers };
