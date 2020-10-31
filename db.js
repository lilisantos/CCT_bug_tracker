const uri = process.env.MONGO_URI;
const MongoClient = require("mongodb").MongoClient;
const ObjectID = require('mongodb').ObjectID
const DB_NAME = "bug-tracker";
const MONGO_OPTIONS = { useUnifiedTopology: true , useNewUrlParser: true };

module.exports = () => {
    
    const count = (collectionName, query = {}) => {
        return new Promise((resolve, reject) => {
            MongoClient.connect(uri, MONGO_OPTIONS, (err, client) => {
                const db = client.db(DB_NAME);
                const collection = db.collection(collectionName);

                collection.countDocuments({query}, (err, docs) => {
                    resolve(docs);
                    client.close();
                });
            });
        });
    };  
   
    const get = (collectionName, query = {}) => {
        return new Promise((resolve, reject) => {
            MongoClient.connect(uri, MONGO_OPTIONS, (err, client) => {
                const db = client.db(DB_NAME);
                const collection = db.collection(collectionName);
                
                collection.find(query).toArray((err, docs) => {
                    resolve(docs);
                    client.close();
                });
            });            
        });
    };

    const getComments = (collectionName, query = {}) => {
        return new Promise((resolve, reject) => {
            MongoClient.connect(uri, MONGO_OPTIONS, (err, client) => {
                const db = client.db(DB_NAME);
                const collection = db.collection(collectionName);                
                
                collection.find({comments: {$exists: true}}).project({comments : 1 }).toArray((err, docs) => {
                    resolve(docs);
                    client.close();
                });
            });            
        });
    };

    const getCommentPerIssue = (collectionName, query = {}) => {
        return new Promise((resolve, reject) => {
            MongoClient.connect(uri, MONGO_OPTIONS, (err, client) => {
                const db = client.db(DB_NAME);
                const collection = db.collection(collectionName);                
                
                collection.find({}).project({comments : 1 }).toArray((err, docs) => {
                    resolve(docs);
                    client.close();
                });
            });            
        });
    };

    const add = (collectionName, item) => {
        return new Promise((resolve, reject) => {
            MongoClient.connect(uri, MONGO_OPTIONS, (err, client) => {
                const db = client.db(DB_NAME);
                const collection = db.collection(collectionName);

                collection.insertOne(item, (err, result) => {
                    resolve(result);
                });
            });
        });
    };

    const aggregate = (collectionName, pipeline = []) => {
        return new Promise((resolve, reject) => {
            MongoClient.connect(uri, MONGO_OPTIONS, (err, client) => {
                const db = client.db(DB_NAME);
                const collection = db.collection(collectionName);

                collection.aggregate(pipeline).toArray((err, docs) => {
                    if (err){
                        console.log(" --- aggregate ERROR ---");
                        console.log(err);
                    }

                    resolve(docs);
                    client.close(err);
                });
            });
        });
    };

    const update = (collectionName, filter, itemUpdate) => {
        return new Promise((resolve, reject) => {
            MongoClient.connect(uri, MONGO_OPTIONS, (err, client) => {
                const db = client.db(DB_NAME);
                const collection = db.collection(collectionName);

                collection.updateOne({filter}, {$set: {itemUpdate}}, {upsert: false}, (err, result) => {
                    resolve(result);
                });
            });
        });
    };   

    const updateComment = (collectionName, filter, itemUpdate) => {
        return new Promise((resolve, reject) => {
            MongoClient.connect(uri, MONGO_OPTIONS, (err, client) => {
                const db = client.db(DB_NAME);
                const collection = db.collection(collectionName);

                collection.updateOne({filter}, {$push: {itemUpdate}}, {upsert: false}, (err, result) => {
                    resolve(result);
                });
            });
        });
    };

    const findProjectID = (slug) => {
        return new Promise((resolve, reject) => {
            MongoClient.connect(uri, MONGO_OPTIONS, (err, client) => {
                const db = client.db(DB_NAME);
                const collection = db.collection("projects");

                collection.findOne({"slug": slug}, (err, docs) => {
                    if(docs == null){
                        resolve(null);
                        client.close();
                    }else{
                        resolve(docs._id);
                        client.close();
                    }                   
                });
            });
        });
    }

    const findUserID = (authorEmail) => {
        return new Promise((resolve, reject) => {
            MongoClient.connect(uri, MONGO_OPTIONS, (err, client) => {
                const db = client.db(DB_NAME);
                const collection = db.collection("users");

                collection.findOne({"email": authorEmail}, (err, docs) => {
                    if(docs == null){
                        resolve(null);
                        client.close();
                    }else{
                        resolve(docs._id);
                        client.close();
                    }
                   
                });
            });
        });
    }

    return {
        get,
        getComments,
        add,
        count,
        aggregate,
        update,
        updateComment,
        findProjectID,
        findUserID,
    };
};