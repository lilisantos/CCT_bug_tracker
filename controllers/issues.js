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
       
        res.json(await issues.getSome((req.params.issueNumber)));
    }


    const getCommentsByIssueNumber = async (req, res) => {
       
        res.json(await issues.get((req.params.issueNumber)));
    }

    const postController = async (req, res) => {
        const {issueNumber, title, description, status, project, comments} = req.body;
        const result = await issues.add(issueNumber, title, description, status, project, comments);
        res.json(result);
    }

    const populatedController = async (req, res) => {
        res.json(await issues.aggregateWithProjects());
    };

    const updateStatus = async (req, res) => {
        // const issueNumber = req.body.issueNumber;
        // const status = req.body.status;

        const {issueNumber, status} = req.body;

        const result = await issues.update(issueNumber, status);
        res.json(result);
    }


    return {
        getController,
        postController,
        getByIssueNumber,
        populatedController,
        updateStatus,
        getComment
    }
}