const express = require('express');
const bodyParser = require('body-parser');
const users = require('./models/users');

//specify address and port the app will run
const hostname = '0.0.0.0';
const port = process.env.PORT || 3000;

//Setup data
const issuesController = require('./controllers/issues')();
const projectsController = require('./controllers/projects')();

const app = module.exports = express();

// //logging
// app.use((req, res, next) => {
//    const FailedAuthMessage = {
//         // https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/401
//        error: "Failed Authentication",
//        message: "Go away!",
//        code: "xxx", //Some useful error code 
//    };

//    const suppliedKey = req.headers["x-api-key"];
//    const clientIp = 
//         req.headers["x-forwarded-for"] || req.connection.remoteAddress;

//         //Check Pre-shared key
//         if(!suppliedKey){
//             console.log(
//                 " [%s] FAILED AUTHENTICATION -- %s, No Key Supplied",
//                 new Date(),
//                 clientIp
//             );
//             FailedAuthMessage.code = "01";
//             return res.status(401).json(FailedAuthMessage);
//         }

//         const user = await users.getByKey(suppliedKey);
//         if(!user){
//             console.log(
//                 " [%s] FAILED AUTHENTICATION -- %s, Bad Key Supplied",
//                 new Date(),
//                 clientIp
//             );
//             FailedAuthMessage.code = "02";
//             return res.status(401).json(FailedAuthMessage);
//         }
   
//     next();
// });

app.use(bodyParser.json());
// app.use((req, res, next) => {
//     //Check Pre-shared key
//     if(req.headers["x-api-key"] !== "my super secret shared key"){
//         const clientIp = req.headers["x-forwared-for"] || req.connection.remoteAddress;

//         console.log(" [%s] FAILED AUTHENTICATION -- %s", new Date(), clientIp);
//         return res.status(401).json({
//             // https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/401
//             error: "Failed Authentication" ,
//             message: "Go away!" ,
//             code: "2345" , // Some useful error code
//         });
//     }

//     next();
// });

//Get all issues
app.get('/issues', issuesController.getController);
//Add an issues
app.post('/issues', issuesController.postController);
//Access an issues
app.get('/issues/:id', issuesController.getById);
//Get all issues with projects
app.get('/issues/populated', issuesController.populatedController);
//Update an issue status
app.post('/issues/update', issuesController.updateStatus);


//Get all projects
app.get('/projects', projectsController.getController);
//Add a projects
app.post('/projects', projectsController.postController);
//Access a projects
app.get('/projects/:id', projectsController.getById);
// app.get('/projects/:slug', projectsController.getBySlug);
//Get all projects with issues
app.get('/projects/populated', projectsController.populatedController);

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



