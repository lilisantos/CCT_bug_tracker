const uri = process.env.MONGO_URI;
const MongoClient = require("mongodb").MongoClient;
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

    // //get only some comments
    // const getSome = (collectionName, query = {}) => {
    //     return new Promise((resolve, reject) => {
    //         MongoClient.connect(uri, MONGO_OPTIONS, (err, client) => {
    //             const db = client.db(DB_NAME);
    //             const collection = db.collection(collectionName);
    //             collection.find({}, { projection: { _id: 0, comments: 1 } }).toArray((err, docs) => {
    //                 resolve(docs);
    //                 client.close();
    //             });
    //         });            
    //     });
    // };

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

    return {
        get,
        add,
        count,
        aggregate,
        update,
        findProjectID
    };
};