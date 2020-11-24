const comments = require('../models/comments.js')();

module.exports = () => {

    const getController = async (req, res) => {
        const {commentList, error} = await comments.get();
        if(error){
            console.log("=== get:: Comments Error");
            return res.status(500).json(error);
        }
        res.json(commentList);
    }

    const getCommentsByAuthorEmail = async (req, res) => {        
        const {commentList, error} = await comments.get((req.params.email));
        if(error){
            console.log("=== getByAuthor:: Comments Error");
            return res.status(500).json(error);
        }
        res.json(commentList);
    }

    const postController = async (req, res) => {
        const {issueNumber, title, description, status, project, comments} = req.body;

        //Check if all fields were provided
        if (issueNumber && title && description && status && project && comments){
            const {result, error} = await issues.add(issueNumber, title, description, status, project, comments);
            if(error){
                console.log("=== post:: Comments Error");
                return res.status(500).json(error);
            }
            res.json(result);
        }else{
            console.log("=== post:: Comments Error -- all fields are required");
        }
    }

    const populatedController = async (req, res) => {
        const {commentUsers, error} = await comments.aggregateWithUsers((req.params.email));

        if(error){
            console.log("=== aggregate Users:: Comments Error");
            return res.status(500).json(error);
        }
        res.json(commentUsers);
    };

    const updateStatus = async (req, res) => {
        const {issueNumber, status} = req.body;

        const {result, error} = await issues.update(issueNumber, status);

        if(error){
            console.log("=== update:: Comments Error");
            return res.status(500).json(error);
        }
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