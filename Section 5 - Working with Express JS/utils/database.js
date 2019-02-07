const mongodb = require('mongodb')
const MongoClient = mongodb.MongoClient;

let _db;

const monggoConnect = (callback) => {
    MongoClient.connect("mongodb+srv://alfianfaiz:bismillah@faiz-c1-wtoh9.mongodb.net/shop?retryWrites=true")
        .then(client => {
            console.log("YAY ! DB CONNECTION SUCCESS !")
            _db = client.db()
            callback()
        })
        .catch(err => {
            console.log("DB CONNECTION FAILED", err)
            throw err
        })
}

const getDb = () => {
    if (_db) {
        return _db;
    }
    throw "No database found"
}

exports.monggoConnect = monggoConnect
exports.getDb = getDb