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

    const add = async(project, comment, user) => {
       const issueCount = await db.count(COLLECTION);
       const results = await db.add(COLLECTION, {
           issueNumber: project(slug) + issueCount,
        //    title: ,
        //    description: ,
           status: status,
           project: project,
           comment: comment,
           
       });
       return results.result;
    }

    const aggregateWithProjects = async() => {
        const issues = await db.aggregate(COLLECTION, LOOKUP_PROJECTS_PIPELINE);
        return issues;
    };

    return {
        get,
        add,
        aggregateWithProjects
    }
};