# Bug Tracker

<h2 align="center">A NodeJS app developed for academic purposes for the course CCT - Cloud Based Web Applications</h2>
<hr />


## Table of contents
- [General Info](https://github.com/lilisantos/CCT_bug_tracker/new/master?readme=1#general-info)
- [Technologies](https://github.com/lilisantos/CCT_bug_tracker/new/master?readme=2#technologies)
- [Setup](https://github.com/lilisantos/CCT_bug_tracker/new/master?readme=3#setup)
- [Features](https://github.com/lilisantos/CCT_bug_tracker/new/master?readme=4#features)
- [Changelog](https://github.com/lilisantos/CCT_bug_tracker/new/master?readme=5#Changelog)
- [Roadmap](https://github.com/lilisantos/CCT_bug_tracker/new/master?readme=6#Roadmap)
- [Contact](https://github.com/lilisantos/CCT_bug_tracker/new/master?readme=7#contact)

## General info
This p

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

- Get all projects:
     ```GET /projects```
- Get individual projects by slug:
 ``` GET /projects/:slug ```
- Add new project;
 ```POST /projects' ```
 
- Get all users:
```GET /users```
- Get users by email:
```GET /users/:email```
- Add a new user individually:
```POST /users```

- Get all issues:
```GET /issues```
- Get individual issues by issueNumber (project.slug + num):
```GET /issues/:issueNumber```
- Get all issues for a project by slug:
```GET /projects/:slug/issues```
- Update the status of an issue:
```PUT /projects/:slug/issues/:issueNumber/:status```
- Add a new issues individually:
```GET /projects/:slug/issues```

- Get all comments:
```GET /comments```
- Get comments for an author:
```GET /comments/:email```
- Get all comments for an issue:
```GET /issues/:issueNumber/comments```
- Get specific comment for an issue:
```GET /issues/:issueNumber/comments/:commentID```
- Add a new comment to an issue:
```GET /issues/:issueNumber/comments```

## Changelog
List of features ready and TODOs for future development

- Continuous Assesment Part 1 for the course CBWA
    * Add and retrieve Projects
    * Add and retrieve Issues
    * Add and retrieve Users
    * Add and retrieve Comments

- Continuous Assesment Part 2 for the course CBWA
    * Implementation of Error Checking
    * Implementation of Duplicate Items Checking
    * Project Dockerized

## Roadmap
To-do list:

- Front-end interface

## Contact
Created by @lilisantos - feel free to contact me!
