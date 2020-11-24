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
        
        const result = await issues.add(issueNumber, title, description, status, project, comments);
        if(error){
            console.log("=== post:: Issues Error");
            return res.status(500).json(error);
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
                
        const {result, error} = await issues.addComment(issueNumber, text, author);
        if(error){
            console.log("=== addComment:: Issues Error");
            return res.status(500).json(error);
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