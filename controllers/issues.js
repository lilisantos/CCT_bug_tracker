const issues = require('../models/issues.js')();

const projects = require('../models/projects.js')();

module.exports = () => {

    const getController = async (req, res) => {
        res.json(await issues.get());
    }

    const getById = async (req, res) => {
       
        res.json(await issues.get(parseInt(req.params.id)));
    }

    const postController = async (req, res) => {
        const issueNumber = req.body.issueNumber;
        const title = req.body.title;
        const description = req.body.description;
        const status = req.body.status;
        const project = req.body.project;
        const comments = req.body.comments;
        const result = await issues.add(issueNumber, title, description, status, project, comments);
        res.json(result);
    }

    const populatedController = async (req, res) => {
        res.json(await issues.aggregateWithProjects());
    };

    const updateStatus = async (req, res) => {
        const issueNumber = req.body.issueNumber;
        const status = req.body.status;

        const result = await issues.update(issueNumber, status);
        res.json(result);
    }


    return {
        getController,
        postController,
        getById,
        populatedController,
        updateStatus,
    }
}