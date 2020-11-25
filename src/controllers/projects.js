const db = require('../../db.js');

const projects = require('../models/projects.js')();

const issues = require('../models/issues.js')();

module.exports = () => {

    const getController = async (req, res) => {
        const {projectList, error} = await projects.get();
        
        if(error){
            console.log("=== get:: Projects Error");
            return res.json(error);
        }
        
        res.json(projectList);
    }

    const getBySlug = async (req, res) => {
        const {project, error} = await projects.get(req.params.slug);
        if(error){
            console.log("=== getBySlug:: Projects Error");
            return res.json(error);
        }
        res.json(project);
    }

    const postController = async (req, res) => {   
        const {slug, name, description} = req.body;
    
        //Checks if any of the fields is null
        if (!slug|| !name|| !description){    
           const error = "===== Not all the fields have been provided:: add ProjectModel Error"
            console.log(error);             
            return res.json(error);
        }
      
        const {results, error} = await projects.add(slug, name, description);         
        if(error){   
            return res.json(error);
        }
    
        res.json(results);
    }

    const postNewIssue = async (req, res) => {
        const {title, description} = req.body;
        const slug = req.params.slug;

        //Checks if any of the fields is null
        if (!title || !description){       
            const error = "===== Not all the fields have been provided:: add IssueModel Error";
            console.log(error);  
            return res.json(error) ;
        }

        //Sets automatically a due date for 30 days from today
        var dueDate = new Date();
        var numberOfDaysToAdd = 30;
        dueDate.setDate(dueDate.getDate() + numberOfDaysToAdd); 

        //Calls the add method on the issues model
        const {result, error} = await issues.add(title, description, slug, dueDate);
        if(error){
            console.log("=== postNewIssue:: Projects Error");
            return res.json(error);
        }
        res.json(result);
    };

    const populatedController = async (req, res) => {
        const {projectIssues, error} = await projects.aggregateWithIssues(req.params.slug);
        if(error){
            console.log("=== aggregate:: Projects Error");
            return res.json(error);
        }
        res.json(projectIssues);
    };

    const updateIssue = async (req, res) => {
        const {issueNumber, status} = req.params;

        //Calls the add method on the issues model
        const {result, error} = await issues.updateStatus(issueNumber, status);
        if(error){
            console.log("=== updateIssue:: Projects Error");
            return res.json(error);
        }
        res.json(result);
    };
   
    return {
        getController,
        postController,
        postNewIssue,
        getBySlug,
        populatedController,
        updateIssue
    };
}