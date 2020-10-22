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
        const result = await issues.add(issueNumber, title, description, status, project, comment);
        res.json(result);
    }

    const populatedController = async (req, res) => {
        res.json(await issues.aggregateWithProjects());
    };


    return {
        getController,
        postController,
        getById,
        populatedController
    }
}