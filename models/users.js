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
     
       try{
          const users = await db.get(COLLECTION, {key});

          if(users.length !== 1){
            console.log("02: Bad key");
            return null;
          } 
          return users[0];
       }catch(ex){
           console.log("==== Exception users:: == getByKey");
           console.log(ex);
           return null;
       }
       
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
        try{
            const hashedKey = await createHash(key);
        }catch(ex){
            return {error: ex}
        }       
    
        try{
            const results = await db.add(COLLECTION, {
                name: name,
                email: email,
                usertype: usertype,
                key: hashedKey,      
             });
             return results.result;
        }catch(ex){
            return {error: ex}
        }
       
     };

    return {
        get,
        add,
        getByKey,
        createHash,
    };
};