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


    const createHash = (password) => {
        
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
      
        const checkEmail = await db.findUserID(email);        

        try{
            //if a user was not found, does nothing
            if(checkEmail != null){
                console.log("===== User already registered with this email:: add UserModel Error");      
                return null;        
                
            }
        }catch(ex){
            return {error: ex};
        }       

        const hashedKey = createHash(key);   
        try{
            //Checks if any of the fields is null
            if (!name || !email || !usertype || !key){       
                console.log("===== Not all the fields have been provided:: add UserModel Error");   
                return null;
            }
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