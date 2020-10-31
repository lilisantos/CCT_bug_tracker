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
            const userID = await db.findUserID(email);
        }
        if(issueNumber){
            const comments = await db.getComments(COLLECTION, {issueNumber});
        }
        
        return comments;
    }

    
    const add = async(project, issueNumber, title, description, status, comments) => {
       const issueCount = await db.count(COLLECTION);
       const results = await db.add(COLLECTION, {
           issueNumber: issueNumber,
           title: title,
           description: description,
           status: status,
           project: project,
           comments: comments          
       });
       return results.result;
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

        console.log(LOOKUP_USERS_PIPELINE);
        const comments = await db.aggregate(COLLECTION, LOOKUP_USERS_PIPELINE);
        return comments;
    };

    const update = async (issueNumber, status) => {
        if(!issueNumber){
            console.log("Issue number required for update");
            return null;
        }
       
        const results = await db.update(COLLECTION, 
            {issueNumber: issueNumber}, //filter
            {status: status} //update
        );
        return results.result;
    };


    return {
        get,
        add,
        aggregateWithUsers,
        update,
    };
};