const db = require('../db')();
const COLLECTION = "projects";

module.exports = () => { 
    
    const get = async (slug = null) => {
        console.log(' inside projects model');
        if(!slug){
            const projects = await db.get(COLLECTION);
            return projects;
        }

        const projects = await db.get(COLLECTION, {slug});
            return projects;        
    }

    const add = async(slug, name, description) => {
       const projectCount = await db.count(COLLECTION);
       const results = await db.add(COLLECTION, {
           slug: slug,
           name: name,
           description: description,
       });
       return results.result;
    }

    const aggregateWithIssues = async(slug) => {
       
        //Pipeline that searches for the project with the slug provided
        const LOOKUP_ISSUES_PIPELINE = [
            {
                $match: {
                    "slug": slug,
                }
            },
            {
                $lookup: {
                    from: "issues",
                    localField: "_id",
                    foreignField: "project",
                    as: "issues",
                }
            },
        ];

        const projects = await db.aggregate(COLLECTION, LOOKUP_ISSUES_PIPELINE);
        return projects;
    }

    return {
        get,
        add,
        aggregateWithIssues,
    }
};