const db = require('../../db')();
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
            try{
                const issues = await db.get(COLLECTION);
                return {issueList: issues};
            }catch(ex){
                return {error: ex};
            }          
        }

        try{
            const issues = await db.get(COLLECTION, {issueNumber});
            return {issueList: issues};
        }catch(ex){
            return {error:ex};
        }       
    }

    //Needs improvement
    const getCommentForIssue = async (issueNumber, commentID) => {        
        if(!commentID){
            try{
                const comments = await db.getComments(COLLECTION);
                return {commentList: comments};
            }catch(ex){
                return {error: ex};
            }          
        }

        try{
            const comments = await db.getComments(COLLECTION, [{commentID}, {issueNumber}]);
            return {commentList: comments};
        }catch(ex){
            return {error: ex}
        }
    }    

    const add = async(title, description, slug, dueDate) => {
        let projectID = null;
        let issueCount = null;
        try{
            projectID = await db.findProjectID(slug);
        }catch(ex){  
            return {error: ex}
        }
        //if no project was found, return error message
        if(projectID == null){
            const error1 = "===== Project not found:: add ProjectModel Error";
            console.log(error1);   
            return {error: error1};
        }    

        try{
            issueCount = await db.count(COLLECTION);
        }catch(ex){
            const e = "=== Issues Count failed";
            return {error: e}
        }  
         //if no project was found, return error message
        if(issueCount == null){
            const error2 = "===== Issue Count returned null:: add ProjectModel Error";
            console.log(error2);   
            return {error: error2};
        }   

        try{
            const results = await db.add(COLLECTION, {
                issueNumber: slug + "-" + (issueCount + 1),
                title: title,
                description: description,
                status: "open",
                project: projectID,
                dueDate: dueDate  
            });
            return results.result;
        }catch(ex){
            const er = "=== Issues Add failed";
            return {error: er}
        }
      
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
                    NumberOfItemsInArray: {size: "$comments"}
                 }
            }
        ];

        let commentsCount = null;
        let userID = null;
        
        try{
             commentsCount = await db.aggregate(COLLECTION, LOOKUP_SIZE_ARRAY_PIPELINE);
        }catch(ex){
            return {error: ex}
        }
         //Get userID
        try{
            userID = await db.findUserID(author);
            
        }catch(ex){
            return {error: ex}
        }   
        if(userID === null){
            const error = "===== User not found:: add CommentsModel Error";      
            console.log(error);
            return {error: error};                    
        }      

        try{
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
        }catch(ex){
            return {error: ex}
        }
       
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