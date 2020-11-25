const db = require("../../db")();
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
            try{
                const users = await db.get(COLLECTION);
                  
                return {userList: users};
            }catch(ex){
                console.log("==== Exception users:: == get");
                console.log(ex);
                return null;
            }
        }
       
        try{
            const users = await db.get(COLLECTION, {email});
            return {userList: users};
        }catch(ex){
            console.log("==== Exception users:: == get w/ email");
            console.log(ex);
            return null;
        }
        
    };

  
    const add = async(name, email, usertype, key) => {
        let checkEmail = null;
        try{
             checkEmail = await db.findUserID(email);      
        }catch(ex){
            return {error: ex};
        }     
        if(checkEmail != null){
            const error = "===== User already registered with this email:: add UserModel Error";      
            console.log(error);
            return {error: error};                    
        }      

        const hashedKey = createHash(key);  
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