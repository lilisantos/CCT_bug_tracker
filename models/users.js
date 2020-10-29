const db = require("../db")();
const COLLECTION = "users";
const bcrypt = require("bcrypt");

module.exports = () => {

    const getByKey = async (key) => {
        if(!key){
            console.log("01: Missing key");
            return null;
        }

        const users = await db.get(COLLECTION, {key});
        if(users.length !== 1){
            console.log("02: Bad key");
            return null;
        }

        return users[0];
    };

    // const hashKey = bcrypt.hash(password, 11, (err, hash) => {
    //     if(err) {
    //         console.log('ERROR HASHING');
    //         console.log(err);
    //     }

    //     console.log(hash);
    //     return hash;
    // });

    // const checkKey = bcrypt.compare(key, , (err, hash) => {
    //     if(err) {
    //         console.log('ERROR HASHING');
    //         console.log(err);
    //     }

    //     console.log(hash);
    //     return hash;
    // });

    
  
    const get = async (email = null) => {
        console.log(' inside users model');
        if(!email){
            const users = await db.get(COLLECTION);
            return users;
        }

        const users = await db.get(COLLECTION, {email});
        return users;
    };

  
    const add = async(name, email, usertype, key) => {
    
        const results = await db.add(COLLECTION, {
           name: name,
           email: email,
           usertype: usertype,
           key: key         
        });
        return results.result;
     };

    return {
        get,
        add,
        getByKey,
    };
};