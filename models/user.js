const { ObjectId } = require('mongodb')
const { getDB } = require('../util/database')

class User {
    constructor(username, email) {
        this.name = username;
        this.email = email
    }

    save() {
        const db = getDB();
        return db.collection('users')
            .insertOne(this)
            .then(result => {
                return result
            }).catch(error => {
                console.log(error)
            })
    }

    static findUserById(userId) {
        const db = getDB();
        return db.collection('users')
            .findOne({ _id: new ObjectId(userId) })
            .then(user => {
                return user
            }).catch(error => {
                console.log(error)
            })
    }

}

module.exports = User