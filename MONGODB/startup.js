//use taskmanager;
db = db.getSiblingDB('taskmanager');


const schema = require('/schemas/taskmanager.task.schemas.json') 



db.createCollection("tasks", 
    {
        validator: schema
    }
);