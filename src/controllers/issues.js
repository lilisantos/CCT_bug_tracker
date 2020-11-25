const issues = require('../models/issues.js')();

const projects = require('../models/projects.js')();

module.exports = () => {

    const getController = async (req, res) => {
        const {issueList, error} = await issues.get();
        if(error){
            console.log("=== get:: Issues Error");
            return res.status(500).json(error);            
        }
        res.json(issueList);
    }

    const getByIssueNumber = async (req, res) => {
        const {issue, error} = await issues.get((req.params.issueNumber));
        if(error){
            console.log("=== get:: Issue Error");
            return res.status(500).json(error);
        }
        res.json(issue);
    }
    
    const getComment = async (req, res) => {
        const {issueNumber, commentID} = req.params;
       
        const {result, error} = await issues.getCommentForIssue(issueNumber, commentID);
        if(error){
            console.log("=== getComment:: Issues Error");
            return res.status(500).json(error);
        }
        res.json(result);
    }

    
    const postController = async (req, res) => {
        const {issueNumber, title, description, status, project, comments} = req.body;
              
        //Checks if any of the fields is null
        if (!title || !description || !slug){       
            const error = "===== Not all the fields have been provided:: add IssueModel Error";
            console.log(error);  
            return res.json(error) ;
        }
         
        const {result, error} = await issues.add(issueNumber, title, description, status, project, comments);
        if(error){
           return res.json(error);
        }
        res.json(result);
    }

    const populatedController = async (req, res) => {
        const {issueProjects, error} = await issues.aggregateWithProjects();
        if(error){
            console.log("=== aggregateProjects:: Issues Error");
            return res.status(500).json(error);
        }
        res.json(issueProjects);
    };

    const addComment = async (req, res) => {
        const {text, author} = req.body;
        const issueNumber = req.params.issueNumber;
        
        //Checks if any of the fields is null
        if (!text || !author){       
            const error = "===== Not all the fields have been provided:: add UserModel Error";   
            console.log(error);
            return res.json(error);
        } 
                
        const {result, error} = await issues.addComment(issueNumber, text, author);
        if(error){
            console.log("=== addComment:: Issues Error");
            return res.json(error);
        }
        res.json(result);
    }

    return {
        getController,
        postController,
        getByIssueNumber,
        populatedController,
        getComment,
        addComment,
    }
}