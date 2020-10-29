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

    //ADD COMMENTS
    // const addComment = async(project, issueNumber, title, description, status, comments) => {
    //     const issueCount = await db.count(COLLECTION);
    //     const results = await db.add(COLLECTION, {
    //         issueNumber: issueNumber,
    //         title: title,
    //         description: description,
    //         status: status,
    //         project: project,
    //         comments: comments          
    //     });
    //     return results.result;
    //  }
        

    const aggregateWithProjects = async() => {
        const issues = await db.aggregate(COLLECTION, LOOKUP_PROJECTS_PIPELINE);
        return issues;
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
        aggregateWithProjects,
        update,
    }
};