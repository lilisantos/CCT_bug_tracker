const { use } = require('..');

const db = require('../db')();

const COLLECTION = "issues";
const LOOKUP_PROJECTS_PIPELINE = [
    {
        $lookup: {
            from: "projects",
            localField: "project",
            foreignField: "id",
            as: "p",
        },
    }
];

module.exports = () => {
   
    const get = async (email = null, issueNumber = null) => {
        console.log(' inside comments model');

        if(email){
            try{
                const userID = await db.findUserID(email);
               
            }catch(ex){
                console.log("=== findUserID:: Comments Error");
                return {error: ex};
            }

            try{
                const comments = await db.getComments(COLLECTION, {userID});
                return {commentList: comments}
            }catch(ex){
                console.log("=== getByUserId:: Comments Error");
                return {error: ex};
            }
           
            
        }else if(issueNumber){
            try{
                const comments = await db.getComments(COLLECTION, {issueNumber});
                return {commentList: comments};
            }catch(ex){
                console.log("=== getByIssue:: Comments Error");
                return {error: ex}
            }
        }        
        
    }

    
    const add = async(project, issueNumber, title, description, status, comments) => {
    //    const issueCount = await db.count(COLLECTION);
        try{
            const results = await db.add(COLLECTION, {
                issueNumber: issueNumber,
                title: title,
                description: description,
                status: status,
                project: project,
                comments: comments          
            });
            return results.result;
        }catch(ex){
            console.log("=== add:: Comments Error");
            return {error: ex};
        }
       
    }

    const aggregateWithUsers = async(email) => {

        const userID = await db.findUserID(email);

        const LOOKUP_USERS_PIPELINE = [
            { $unwind: {
                    path: '$comments',
                    preserveNullAndEmptyArrays: false
                }
            },    
          
            {
                $match: {
                    'comments.author':  userID
                }
            },
            {
                $project: {
                    _id: 0,
                    comments: 1
                }
            }
        ]

       try{
          const comments = await db.aggregate(COLLECTION, LOOKUP_USERS_PIPELINE);
          return {commentUsers: comments};
       }catch(ex){
           console.log("=== aggregate Users:: Comments Error");
           return {error: ex};
       }
        
       
    };

    const update = async (issueNumber, status) => {
        if(!issueNumber){
            console.log("Issue number required for update");
            return null;
        }
       
        try{
            const results = await db.update(COLLECTION, 
                {issueNumber: issueNumber}, //filter
                {status: status} //update
            );
            return results.result;
        }catch(ex){
            console.log("=== update:: Comments Error");
            return {error: ex}
        }
       
    };


    return {
        get,
        add,
        aggregateWithUsers,
        update,
    };
};