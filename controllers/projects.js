const db = require('../db.js');

const projects = require('../models/projects.js')();

const issues = require('../models/issues.js')();

module.exports = () => {

    const getController = async (req, res) => {
        res.json(await projects.get());
    }

    const getBySlug = async (req, res) => {
        res.json(await projects.get(req.params.slug));
        console.log(projects.get(parseInt(req.params.slug)));
    }

    const postController = async (req, res) => {
        const {slug, name, description} = req.body;
        const result = await projects.add(slug, name, description);
        res.json(result);
    }

    const postNewIssue = async (req, res) => {
        const {title, description} = req.body;
        const slug = req.params.slug;
        //Calls the add method on the issues model
        const result = await issues.add(title, description, slug);
        res.json(result);
    };

    const populatedController = async (req, res) => {
        res.json(await projects.aggregateWithIssues(req.params.slug));
    };

    const updateIssue = async (req, res) => {
        const {issueNumber, status} = req.params;

        console.log("Project controller:" + issueNumber);
        console.log("Project controller STATUS:" + status);

        //Calls the add method on the issues model
        const result = await issues.update(issueNumber, status);
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