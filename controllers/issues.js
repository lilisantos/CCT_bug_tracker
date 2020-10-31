const issues = require('../models/issues.js')();

const projects = require('../models/projects.js')();

module.exports = () => {

    const getController = async (req, res) => {
        res.json(await issues.get());
    }

    const getByIssueNumber = async (req, res) => {
       
        res.json(await issues.get((req.params.issueNumber)));
    }
    
    const getComment = async (req, res) => {
        const {issueNumber, commentID} = req.params;
       
        res.json(await issues.getCommentForIssue(issueNumber, commentID));
    }

    
    const postController = async (req, res) => {
        const {issueNumber, title, description, status, project, comments} = req.body;
        const result = await issues.add(issueNumber, title, description, status, project, comments);
        res.json(result);
    }

    const populatedController = async (req, res) => {
        res.json(await issues.aggregateWithProjects());
    };

    const addComment = async (req, res) => {
        const {text, author} = req.body;
        const issueNumber = req.params.issueNumber;
        
        const result = await issues.addComment(issueNumber, text, author);
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