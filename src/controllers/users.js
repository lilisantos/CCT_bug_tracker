const users = require('../models/users.js')();

module.exports = () => {
    

    const getController = async (req, res) => {
        const {userList, error} = await users.get();
        if(error){
            
            return res.status(500).json({error});
        }
        res.json(userList);
    }

    const getByEmail = async (req, res) => {
        const {user, error} = await users.get(req.params.email);
        if(error){
            return res.status(500).json({error});
        }
        res.json(user);
    }

    const postController = async (req, res) => {
        const {name, email, usertype, key} = req.body;

        //Checks if any of the fields is null
        if (!name || !email || !usertype || !key){       
            const error = "===== Not all the fields have been provided:: add UserModel Error";   
            console.log(error);
            return res.json(error);
        } 

        const {results, error} = await users.add(name, email, usertype, key);
        if(error){
            return res.json(error);
        }
        res.json(results);
    }

    return {
        getController,
        postController,
        getByEmail
    }
}

