const db = require('../db')();
const COLLECTION = "projects";

module.exports = () => { 
    
    const get = async (slug = null) => {
        console.log(' inside projects model');
        if(!slug){
          try{
            const projects = await db.get(COLLECTION);
            return {projectList: projects};
          }catch(ex){
            return {error: ex}
          }           
        }

        try{
          const projects = await db.get(COLLECTION, {slug});
          return {projectList: projects};   
        }catch(ex){
          return {error: ex}
        }
             
    }

    const add = async(slug, name, description) => {
      try{
        const results = await db.add(COLLECTION, {
          slug: slug,
          name: name,
          description: description,
         });
         return results.result;
      }catch(ex){
          return {error: ex}
      }
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

        try {
          const projects = await db.aggregate(COLLECTION, LOOKUP_ISSUES_PIPELINE);
          return projects;
        }catch(ex){
          return {error: ex}
        }        
    }

    return {
        get,
        add,
        aggregateWithIssues,
    }
};