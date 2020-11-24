const uri = process.env.MONGO_URI;
const MongoClient = require("mongodb").MongoClient;
const ObjectID = require('mongodb').ObjectID
const DB_NAME = "bug-tracker";
const MONGO_OPTIONS = { useUnifiedTopology: true , useNewUrlParser: true };

module.exports = () => {
    
    const count = (collectionName, query = {}) => {
        return new Promise((resolve, reject) => {
            MongoClient.connect(uri, MONGO_OPTIONS, (err, client) => {
                if(err){
                    console.log("=== count:: MongoCLient.connect");
                    console.log(err);
                    return reject(err);
                }

                const db = client.db(DB_NAME);
                const collection = db.collection(collectionName);

                collection.countDocuments({query}, (err, docs) => {
                    if(err){
                        console.log("=== count:: MongoCLient.count");
                        console.log(err);
                        return reject(err);
                    }
                    resolve(docs);
                    client.close();
                });
            });
        });
    };  
   
    // const get = (collectionName, query = {}) => {
    //     return new Promise((resolve, reject) => {
    //         MongoClient.connect(uri, MONGO_OPTIONS, (err, client) => {
    //             const db = client.db(DB_NAME);
    //             const collection = db.collection(collectionName);
                
    //             collection.find(query).toArray((err, docs) => {
    //                 resolve(docs);
    //                 client.close();
    //             });
    //         });            
    //     });
    // };

    const get = (collectionName, query = {}) => {
        return new Promise((resolve, reject) => {
            MongoClient.connect(uri, MONGO_OPTIONS, (err, client) => {
                if(err){
                    console.log("==== get:: MongoCLient.connect");
                    console.log(err);
                    return reject(err);
                }
                const db = client.db(DB_NAME);
                const collection = db.collection(collectionName);

                collection.find(query).toArray((err, docs) => {
                if (err) {
                    console.log("  ==== get::collection.find");
                    console.log(err);
                    return reject(err);
                }

                resolve(docs);
                client.close();
                });
            });
        });
    };


    const getComments = (collectionName, query = {}) => {
        return new Promise((resolve, reject) => {
            MongoClient.connect(uri, MONGO_OPTIONS, (err, client) => {
                if(err){
                    console.log("==== getComments:: MongoCLient.connect");
                    console.log(err);
                    return reject(err);
                }

                const db = client.db(DB_NAME);
                const collection = db.collection(collectionName);                
                
                collection.find({comments: {$exists: true}}).project({comments : 1 }).toArray((err, docs) => {
                    if(err){
                        console.log("==== getComments:: MongoCLient.find");
                        console.log(err);
                        return reject(err);
                    }
                    resolve(docs);
                    client.close();
                });
            });            
        });
    };

    const getCommentPerIssue = (collectionName, query = {}) => {
        return new Promise((resolve, reject) => {
            MongoClient.connect(uri, MONGO_OPTIONS, (err, client) => {
                if(err){
                    console.log("==== getCommentPerIssue:: MongoCLient.connect");
                    console.log(err);
                    return reject(err);
                }
                const db = client.db(DB_NAME);
                const collection = db.collection(collectionName);                
                
                collection.find({}).project({comments : 1 }).toArray((err, docs) => {
                    if(err){
                        console.log("==== getCommentPerIssue:: MongoCLient.find");
                        console.log(err);
                        return reject(err);
                    }
                    resolve(docs);
                    client.close();
                });
            });            
        });
    };

    const add = (collectionName, item) => {
        return new Promise((resolve, reject) => {
            MongoClient.connect(uri, MONGO_OPTIONS, (err, client) => {

                if(err){
                    console.log("==== add:: MongoCLient.connect");
                    console.log(err);
                    return reject(err);
                }
                const db = client.db(DB_NAME);
                const collection = db.collection(collectionName);

                collection.insertOne(item, (err, result) => {
                    if(err){
                        console.log("==== add:: MongoCLient.insert");
                        console.log(err);
                        return reject(err);
                    }
                    resolve(result);
                });
            });
        });
    };

    const aggregate = (collectionName, pipeline = []) => {
        return new Promise((resolve, reject) => {
            MongoClient.connect(uri, MONGO_OPTIONS, (err, client) => {
                if(err){
                    console.log("==== aggregate:: MongoCLient.connect");
                    console.log(err);
                    return reject(err);
                }
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
                if(err){
                    console.log("==== update:: MongoCLient.connect");
                    console.log(err);
                    return reject(err);
                }
                const db = client.db(DB_NAME);
                const collection = db.collection(collectionName);

                collection.updateOne({filter}, {$set: {itemUpdate}}, {upsert: false}, (err, result) => {
                    if(err){
                        console.log("==== update:: MongoCLient.update");
                        console.log(err);
                        return reject(err);
                    }
                    
                    resolve(result);
                });
            });
        });
    };   

    const updateComment = (collectionName, filter, itemUpdate) => {
        return new Promise((resolve, reject) => {
            MongoClient.connect(uri, MONGO_OPTIONS, (err, client) => {
                if(err){
                    console.log("==== updateComment:: MongoCLient.connect");
                    console.log(err);
                    return reject(err);
                }
                const db = client.db(DB_NAME);
                const collection = db.collection(collectionName);

                collection.updateOne({filter}, {$push: {itemUpdate}}, {upsert: false}, (err, result) => {
                    if(err){
                        console.log("==== updateComment:: MongoCLient.update");
                        console.log(err);
                        return reject(err);
                    }
                    resolve(result);
                });
            });
        });
    };

    const findProjectID = (slug) => {
        return new Promise((resolve, reject) => {
            MongoClient.connect(uri, MONGO_OPTIONS, (err, client) => {
                if(err){
                    console.log("==== findProjectID:: MongoCLient.connect");
                    console.log(err);
                    return reject(err);
                }
                const db = client.db(DB_NAME);
                const collection = db.collection("projects");

                collection.findOne({"slug": slug}, (err, docs) => {
                    if(err){
                        console.log("==== findProjectID:: MongoCLient.find");
                        console.log(err);
                        return reject(err);
                    }

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
                if(err){
                    console.log("==== findUserId:: MongoCLient.connect");
                    console.log(err);
                    return reject(err);
                }
                const db = client.db(DB_NAME);
                const collection = db.collection("users");

                collection.findOne({"email": authorEmail}, (err, docs) => {
                    if(err){
                        console.log("==== findUserId:: MongoCLient.find");
                        console.log(err);
                        return reject(err);
                    }

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