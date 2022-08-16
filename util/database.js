const mongodb = require('mongodb')

const MongoClient = mongodb.MongoClient;

let _db;

const mongoConnect = (callback) => {

    MongoClient.connect('mongodb+srv://mohamednajiub:lvM8pUZScsw5lzBn@cluster0.kr2iwxv.mongodb.net/?retryWrites=true&w=majority')
        .then(connection => {
            _db = connection.db('shop')
            callback()
        })
        .catch(error => {
            console.log(error)
            throw error
        })
}

const getDB = () => {
    if (_db) {
        return _db
    }

    throw 'No Database found!';
}

exports.mongoConnect = mongoConnect
exports.getDB = getDB
