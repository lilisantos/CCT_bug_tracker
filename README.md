# Bug Tracker
## Table of contents
- [General Info](https://github.com/lilisantos/CCT_bug_tracker/new/master?readme=1#general-info)
- [Technologies](https://github.com/lilisantos/CCT_bug_tracker/new/master?readme=2#technologies)
- [Setup](https://github.com/lilisantos/CCT_bug_tracker/new/master?readme=3#setup)
- [Features](https://github.com/lilisantos/CCT_bug_tracker/new/master?readme=4#features)
- [Changelog](https://github.com/lilisantos/CCT_bug_tracker/new/master?readme=5#Changelog)
- [Roadmap](https://github.com/lilisantos/CCT_bug_tracker/new/master?readme=6#Roadmap)
- [Contact](https://github.com/lilisantos/CCT_bug_tracker/new/master?readme=7#contact)

## General info
This project is an APO to simulate a bug tracker system. The user can register new projects and add issues related to these. It is also possible to add new comments to the issues, as well as change its status.

## Technologies
- NodeJS - version 14.15.0
- MongoDB - version 4.2.10
- ExpressJS - version 4.17.1
- BCrypt - version 5.0.0

## Setup
1. Clone this repo using git clone https://https://github.com/lilisantos/CCT_bug_tracker.
2. Move to the appropriate directory: cd CCT_Bug_Tracker.
3. Run npm install to install dependencies.
4. Run npm start, it will open the browser when ready.

## Example Usage
The API works based on the following routes:

- Get all projects
app.get('/projects', projectsController.getController);
- Get individual projects by slug
app.get('/projects/:slug', projectsController.getBySlug);
- Add new project
app.post('/projects', projectsController.postController);

- Get all users
app.get('/users', usersController.getController);
- Get users by email
app.get('/users/:email', usersController.getByEmail);
- Add a new user individually
app.post('/users', usersController.postController);

- Get all issues
app.get('/issues', issuesController.getController);
- Get individual issues by issueNumber (project.slug + num)
app.get('/issues/:issueNumber', issuesController.getByIssueNumber);
- Get all issues for a project by slug
app.get('/projects/:slug/issues', projectsController.populatedController);
- Update the status of an issue
app.put('/projects/:slug/issues/:issueNumber/:status', projectsController.updateIssue);
- Add a new issues individually
app.post('/projects/:slug/issues', projectsController.postNewIssue);

- Get all comments
app.get('/comments', commentsController.getController);
- Get comments for an author
app.get('/comments/:email', commentsController.populatedController);
- Get all comments for an issue
app.get('/issues/:issueNumber/comments', issuesController.getByIssueNumber);
- Get specific comment for an issue
app.get('/issues/:issueNumber/comments/:commentID', issuesController.getComment);
- Add a new comment to an issue
app.post('/issues/:issueNumber/comments', issuesController.addComment);


## Changelog
List of features ready and TODOs for future development

* Continuous Assesment Part 1 for the course CBWA
    * Add and retrieve Projects
    * Add and retrieve Issues
    * Add and retrieve Users
    * Add and retrieve Comments

* Continuous Assesment Part 2 for the course CBWA
    * Implementation of Error Checking
    * Implementation of Duplicate Items Checking

## Roadmap
To-do list:

- Front-end interface

## Contact
Created by @lilisantos - feel free to contact me!
