const express = require('express');
const bodyParser = require('body-parser');

//specify address and port the app will run
const hostname = '0.0.0.0';
const port = process.env.PORT || 3000;

//Setup data
const issuesController = require('./controllers/issues')();
const projectsController = require('./controllers/projects')();
const usersController = require('./controllers/users')();

const users = require('./models/users')();

const app = (module.exports = express());

const myPassword = "foobarbaz";

// console.log( undefined
//     crypto.createHash('md5').update(myPassword).digest('hex'));

//Salt
// function createHash(clearTextPassword, userSalt){
//     const ALGO = "sha256";
//     const SITE_SALT = "Some random text that we keep private";
//     let hash = SITE_SALT + userSalt + clearTextPassword;
//     hash = crypto.createHash(ALGO).update(hash).digest("hex");

//     return hash;
// }

// function getHash(clearTextPassword){
//     const userSalt = crypto.randomBytes(10).toString('hex');
//     const hash = createHash(clearTextPassword, userSalt);

//     return userSalt + '.' + hash;
// }

// console.log(
//     getHash(myPassword));


//Logging
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
   const clientIp = 
        req.headers["x-forwarded-for"] || req.connection.remoteAddress;

        //Check Pre-shared key
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

//Get all issues
app.get('/issues', issuesController.getController);
//Get an issue by issueNumber (project.slug + num)
app.get('/issues/:issueNumber', issuesController.getByIssueNumber);

//Get all issues with projects
// app.get('/issues/populated', issuesController.populatedController);



//Get all projects
app.get('/projects', projectsController.getController);
//Get project by slug
app.get('/projects/:slug', projectsController.getBySlug);
//Get issues for a project by slug
app.get('/projects/:slug/issues', projectsController.populatedController);
//Add an issues
app.post('/projects/:slug/issues', projectsController.postNewIssue);
//Add a projects
app.post('/projects', projectsController.postController);
//Update an issue status
app.put('/projects/:slug/issues/:issueNumber/:status', projectsController.updateIssue);


//Get all users
app.get('/users', usersController.getController);
//Get users by email
app.get('/users/:email', usersController.getByEmail);
//Add a users
app.post('/users', usersController.postController);

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



