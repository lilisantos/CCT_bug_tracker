const express = require('express');
const bodyParser = require('body-parser');

//specify address and port the app will run
const hostname = '0.0.0.0';
const port = process.env.PORT || 3000;

//Setup data
const issuesController = require('./controllers/issues')();
const projectsController = require('./controllers/projects')();
const usersController = require('./controllers/users')();
const commentsController = require('./controllers/comments')();

const users = require('./models/users')();

const app = (module.exports = express());

//Logging with Hash
app.use((req, res, next) => {
    //Display log for requests
    console.log("[%s] %s -- %s", new Date(), req.method, req.url);
    next();
});

app.use(async(req, res, next) => {
   const FailedAuthMessage = {
        // https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/401
       error: "Failed Authentication",
       message: "Go away!",
       code: "xxx", //Some useful error code 
   };

   const suppliedKey = req.headers["x-api-key"];
//    const hashedKey = await users.createHash(suppliedKey);

   const clientIp = 
        req.headers["x-forwarded-for"] || req.connection.remoteAddress;

        if(!suppliedKey){
            console.log(
                " [%s] FAILED AUTHENTICATION -- %s, No Key Supplied",
                new Date(),
                clientIp
            );
            FailedAuthMessage.code = "01";
            return res.status(401).json(FailedAuthMessage);
        }
              

        const user = await users.getByKey(suppliedKey);
        
        if(!user){
            console.log(
                " [%s] FAILED AUTHENTICATION -- %s, Bad Key Supplied",
                new Date(),
                clientIp
            );
            FailedAuthMessage.code = "02";
            return res.status(401).json(FailedAuthMessage);
        }
   
    next();
});

app.use(bodyParser.json());

app.get("/", (req, res) => {
    res.json({
        bug: "tracker",
    });
});


//Get all projects
app.get('/projects', projectsController.getController);
//Get individual projects by slug
app.get('/projects/:slug', projectsController.getBySlug);
//Add new project
app.post('/projects', projectsController.postController);


//Get all users
app.get('/users', usersController.getController);
//Get users by email
app.get('/users/:email', usersController.getByEmail);
//Add a new user individually
app.post('/users', usersController.postController);

//Get all issues
app.get('/issues', issuesController.getController);
//Get individual issues by issueNumber (project.slug + num)
app.get('/issues/:issueNumber', issuesController.getByIssueNumber);
//Get all issues for a project by slug
app.get('/projects/:slug/issues', projectsController.populatedController);
//Update the status of an issue
app.put('/projects/:slug/issues/:issueNumber/:status', projectsController.updateIssue);
//Add a new issues individually
app.post('/projects/:slug/issues', projectsController.postNewIssue);

//Get all comments
app.get('/comments', commentsController.getController);
//Get comments for an author
app.get('/comments/:email', commentsController.populatedController);
//Get all comments for an issue
app.get('/issues/:issueNumber/comments', issuesController.getByIssueNumber);
//Get specific comment for an issue
app.get('/issues/:issueNumber/comments/:commentID', issuesController.getComment);
//Add a new comment to an issue
app.post('/issues/:issueNumber/comments', issuesController.addComment);

app.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);    
});

//404
app.use((req, res) => {
    res.status(404).json({
        error: 404,
        message: 'Route not found',
    });
});



