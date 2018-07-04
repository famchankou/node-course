let MongoClient = require("mongodb").MongoClient;

const URL = "mongodb://localhost:27017/node-course";
const FIXTURES = require("./fixtures.json");
const DB_NAME = "node-course";
const COLLECTION_NAME = "cities";

class MongoDBConnector {
    static start() {
        MongoClient.connect(URL, (err, db) => {
            if (err) throw err;
            console.log("Connected to server on port 27017...");
            db.close();
        });
    }

    static createCollection(callback = _ => {}) {
        MongoClient.connect(URL, (err, db) => {
            if (err) throw err;
            let dbo = db.db(DB_NAME);
            dbo.createCollection(COLLECTION_NAME, (err, res) => {
                if (err) throw err;
                callback(res);
                db.close();
            });
        });
    }

    static insertDocuments(callback = _ => {}) {
        MongoClient.connect(URL, (err, db) => {
            if (err) throw err;
            let dbo = db.db(DB_NAME);

            dbo.collection(COLLECTION_NAME).insertMany(FIXTURES, (err, res) => {
                if (err) throw err;
                callback(res);
                db.close();
            });
        });
    }

    static insertDocument(city, callback = _ => {}) {
        MongoClient.connect(URL, (err, db) => {
            if (err) throw err;
            let dbo = db.db(DB_NAME);
            dbo.collection(COLLECTION_NAME).insertOne(city, (err, res) => {
                if (err) throw err;
                callback(res);
                db.close();
            });
        });
    }

    static updateDocument(query, newValue, callback = _ => {}) {
        MongoClient.connect(URL, (err, db) => {
            if (err) throw err;
            let dbo = db.db(DB_NAME);
            dbo.collection(COLLECTION_NAME).updateOne(query, newValue, (err, res) => {
                if (err) throw err;
                callback(res);
                db.close();
            });
        });
    }

    static deleteDocument(query, callback = _ => {}) {
        MongoClient.connect(URL, (err, db) => {
            if (err) throw err;
            let dbo = db.db(DB_NAME);
            dbo.collection(COLLECTION_NAME).deleteOne(query, (err, obj) => {
                if (err) throw err;
                callback(obj);
                db.close();
            });
        });
    }

    static findDocuments(query, callback = _ => {}) {
        MongoClient.connect(URL, (err, db) => {
            if (err) throw err;
            let dbo = db.db(DB_NAME);
            dbo.collection(COLLECTION_NAME).findOne(query, (err, result) => {
                if (err) throw err;
                callback(result);
                db.close();
            });
        });
    }

    static findAll(callback = _ => {}) {
        MongoClient.connect(URL, (err, db) => {
            if (err) throw err;
            let dbo = db.db(DB_NAME);
            dbo.collection(COLLECTION_NAME).find({}).toArray((err, result) => {
                if (err) throw err;
                callback(result);
                db.close();
            });
        });
    }
}

module.exports = MongoDBConnector;
