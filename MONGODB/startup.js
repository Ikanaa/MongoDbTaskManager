//use taskmanager;

db = db.getSiblingDB('taskmanager');
db.createCollection("tasks");
db.tasks.insert({
    "name": "Task 1",
    "description": "Task 1 Description",
    "status": "In Progress",
})