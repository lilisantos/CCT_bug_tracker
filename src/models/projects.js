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
     
      const checkProject = await db.findProjectID(slug);
      try{
          //if a project was found, return error message
          if(checkProject != null){
            console.log("===== Project already registered with this slug:: add ProjectModel Error");              
            return null;
           
          }
      }catch(ex){       
          return {error: ex}
      }

      try{
        //Checks if any of the fields is null
        if (!slug || !name || !description){       
            console.log("===== Not all the fields have been provided:: add ProjectModel Error");   
            return null;
        }
    }catch(ex){       
        return {error: ex}
    }       
 

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