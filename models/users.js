const db = require("../db")();
const COLLECTION = "users";
const bcrypt = require("bcrypt");

module.exports = () => {

    const getByKey = async (key, hashedKey) => {

        if(!key){
            console.log("01: Missing key");
            return null;
        }
                
        // const match = await bcrypt.compare(key, hashedKey);  
       
        const users = await db.get(COLLECTION, {key});
        console.log("users: " + users[0]);
        if(users.length !== 1){
            console.log("02: Bad key");
            return null;
        }
        
        
        return users[0];
    };

    const createHash = async(password) => {
        
       const hash = bcrypt.hash(password, 11);

       return hash;        
    }       
    
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
        
        const hashedKey = await createHash(key);
    
        const results = await db.add(COLLECTION, {
           name: name,
           email: email,
           usertype: usertype,
           key: hashedKey,      
        });
        return results.result;
     };

    return {
        get,
        add,
        getByKey,
        createHash,
    };
};