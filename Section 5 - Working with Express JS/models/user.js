const {getDb} = require('../utils/database')
const mongodb = require('mongodb')
const {debugModelLog, debugModelError} = require('../utils/debugger')

class User {
    constructor(username, email, id) {
        this.username = username
        this.email = email
        if(id)
            this._id = mongodb.ObjectID(id)
    }

    save() {
        const db = getDb()
        let dbOp
        if(this._id) {
            dbOp = db.collection('users')
                    .updateOne({_id: this._id}, {$set: this})
        } else {
            dbOp = db.collection('users')
                    .insertOne(this)
        } 

        return dbOp
            .then(result => {
                debugModelLog("Success saving user to db")
            })
            .catch(err => {
                debugModelError("Error saving user to db")
            })
            
    }

    static findById(userId) {
        const db = getDb()
        return db.collection('users')
            .find({_id: mongodb.ObjectID(userId)})
            .next()
            .then(user => {
                debugModelLog("Success find user by id")
                return user
            })
            .catch(err => {
                debugModelError("Failed find user by id", err)
            })
    }


}

module.exports = User
