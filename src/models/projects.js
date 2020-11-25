const db = require('../../db')();
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
      let checkProject = null;

      try{
         checkProject = await db.findProjectID(slug);
        }catch(ex){       
          return {error: ex}
      }
      //if a project was found, return error message
      if(checkProject != null){
        const error1 = "===== Project already registered with this slug:: add ProjectModel Error";
        console.log(error1);     
        return {error: error1};
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