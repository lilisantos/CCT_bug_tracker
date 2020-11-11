const db = require('../db.js');

const projects = require('../models/projects.js')();

const issues = require('../models/issues.js')();

module.exports = () => {

    const getController = async (req, res) => {
        const {projectList, error} = await projects.get();
        if(error){
            console.log("=== get:: Projects Error");
            return res.status(500).json(error);
        }
        res.json(projectList);
    }

    const getBySlug = async (req, res) => {
        const {project, error} = await projects.get(req.params.slug);
        if(error){
            console.log("=== getBySlug:: Projects Error");
            return res.status(500).json(error);
        }
        res.json(project);
    }

    const postController = async (req, res) => {   
        const {slug, name, description} = req.body;

        const {results, error} = await projects.add(slug, name, description);
        if(error){
            console.log("=== post:: Projects Error");
            return res.status(500).json(error);
        }
        res.json(result);
    }

    const postNewIssue = async (req, res) => {
        const {title, description} = req.body;
        const slug = req.params.slug;
        //Calls the add method on the issues model
        const {result, error} = await issues.add(title, description, slug);

        if(error){
            console.log("=== postNewIssue:: Projects Error");
            return res.status(500).json(error);
        }
        res.json(result);
    };

    const populatedController = async (req, res) => {
        const {projectIssues, error} = await projects.aggregateWithIssues(req.params.slug);
        if(error){
            console.log("=== aggregate:: Projects Error");
            return res.status(500).json(error);
        }
        res.json(projectIssues);
    };

    const updateIssue = async (req, res) => {
        const {issueNumber, status} = req.params;

        //Calls the add method on the issues model
        const {result, error} = await issues.updateStatus(issueNumber, status);
        if(error){
            console.log("=== updateIssue:: Projects Error");
            return res.status(500).json(error);
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