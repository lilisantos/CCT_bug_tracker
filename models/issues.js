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
   
    const get = async (issueNumber = null) => {
        console.log(' inside issues model');
        if(!issueNumber){
            const issues = await db.get(COLLECTION);
            return issues;
        }

        const issues = await db.get(COLLECTION, {issueNumber});
        return issues;
    }

    //Needs improvement
    const getCommentForIssue = async (issueNumber, commentID) => {
        if(!commentID){
            const comments = await db.getComments(COLLECTION);
            return comments;
        }

        const comments = await db.getComments(COLLECTION, [{commentID}, {issueNumber}]);
        
        return comments;
    }    

    const add = async(title, description, slug) => {
       const projectID = await db.findProjectID(slug);
       const issueCount = await db.count(COLLECTION);

       const results = await db.add(COLLECTION, {
           issueNumber: slug + "-" + (issueCount + 1),
           title: title,
           description: description,
           status: "open",
           project: projectID    
       });
       return results.result;
    }

    const addComment = async(issueNumber, text, author) => {
               
        const LOOKUP_SIZE_ARRAY_PIPELINE = [
            {               
                $match: {
                   'issueNumber' : issueNumber
                }
            },
            {
                $project:{
                    NumberOfItemsInArray: {$size: "$comments"}
                 }
            }
        ];
        const commentsCount = await db.aggregate(COLLECTION, LOOKUP_SIZE_ARRAY_PIPELINE);

        const userID = await db.findUserID(author);

        const results = await db.updateComment(COLLECTION, 
            {issueNumber: issueNumber}, //filter
            {comments: [
                {id: commentsCount.NumberOfItemsInArray + 1,
                text: text,
                author: userID,
                }]
            } //update
        );
        return results.result;
     }

    const aggregateWithProjects = async() => {
        const issues = await db.aggregate(COLLECTION, LOOKUP_PROJECTS_PIPELINE);
        return issues;
    };

    const aggregateWithUsers = async(email) => {
        const LOOKUP_USERS_PIPELINE = [
            {
                $match: {
                    'email': 'email'
                }
            },
            {
                $lookup: {
                    from: "users",
                    localField: "author",
                    foreignField: "id",
                    as: "a",
                },
            }
        ];

        const issues = await db.aggregate(COLLECTION, LOOKUP_USERS_PIPELINE);
        return issues;
    };
    

    const updateStatus = async (issueNumber, status) => {
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
        aggregateWithProjects,
        aggregateWithUsers,
        updateStatus,
        addComment,
        getCommentForIssue,
    }
};