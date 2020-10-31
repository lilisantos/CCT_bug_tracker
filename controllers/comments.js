const comments = require('../models/comments.js')();

module.exports = () => {

    const getController = async (req, res) => {
        res.json(await comments.get());
    }

    const getCommentsByAuthorEmail = async (req, res) => {        
       
        res.json(await comments.get((req.params.email)));
    }

    const postController = async (req, res) => {
        const {issueNumber, title, description, status, project, comments} = req.body;
        const result = await issues.add(issueNumber, title, description, status, project, comments);
        res.json(result);
    }

    const populatedController = async (req, res) => {
        res.json(await comments.aggregateWithUsers((req.params.email)));
    };

    const updateStatus = async (req, res) => {
        const {issueNumber, status} = req.body;

        const result = await issues.update(issueNumber, status);
        res.json(result);
    };


    return {
        getController,
        postController,
        getCommentsByAuthorEmail,
        populatedController,
        updateStatus,
        
    }
}