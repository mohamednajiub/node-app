const mongodb = require('mongodb')

const MongoClient = mongodb.MongoClient;

const mongoConnect = (callback) => {

    MongoClient.connect('mongodb+srv://mohamednajiub:lvM8pUZScsw5lzBn@cluster0.kr2iwxv.mongodb.net/?retryWrites=true&w=majority')
        .then(connection => {
            callback(connection)
        })
        .catch(error => {
            console.log(error)
        })
}

module.exports = mongoConnect