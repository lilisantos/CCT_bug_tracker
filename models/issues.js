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
    },
    {
        $project: {
            id: 1,
            name: 1,
            project: {
                $arrayElemAt: ["$p", 0],
            },
        },
    },
];


module.exports = () => {
   
    const get = async (id = null) => {
        console.log(' inside issues model');
        if(!id){
            const issues = await db.get(COLLECTION);
            return issues;
        }

        const issues = await db.get(COLLECTION, {id});
        return issues;
    }

    const add = async(project, comments, user) => {
       const issueCount = await db.count(COLLECTION);
       const results = await db.add(COLLECTION, {
           issueNumber: issueCount + 1,
           title: title,
           description: description,
           status: status,
           project: project,
           comments: comments           
       });
       return results.result;
    }

    //ADD COMMENTS
    // results = await db.add(collection, {
    //     id: id,
    //     comments: [
    //     text: "your text"
    //     ]
    //     } 
        

    const aggregateWithProjects = async() => {
        const issues = await db.aggregate(COLLECTION, LOOKUP_PROJECTS_PIPELINE);
        return issues;
    };

    const update = async () => {
        // if(!id){
        //     console.log("ID needed for update");
        // }

        const results = await db.update(COLLECTION, 
            {issueNumber: issueNumber}, //filter
            {itemUpdate: status} //update
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