const express = require("express");
const mongodb = require("mongodb");
const MongoClient = require("mongodb").MongoClient;
const ObjectID = require("mongodb").ObjectID;
require('dotenv').config();
const todoRoutes = express.Router();
const cors = require("cors");
const path = require("path");
const port = process.env.PORT || 4000;

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


const dbName = process.env.DB_NAME;
let db;
let dbClient;

// const runDbSchemaValidation = function(){
//     return db.runCommand( {
//         collMod: "todos",
//         validator: { $jsonSchema: {
//            bsonType: "object",
//            required: [ "description", "responsible","priority", "completed" ],
//            properties: {
//               description: {
//                  bsonType: "string",
//                  description: "must be a string and is required"
//               },
//               responsibility: {
//                  bsonType: "string",
//                  description: "must be a string and is required"
//               },
//               priority: {
//                 bsonType: "string",
//                 description: "must be a string and is required"
//              },
//              completed: {
//                 bsonType: "bool",
//                 description: "must be a either true or false and is required"
//              }
//            }
//         } },
//         validationLevel: "strict"
//      } );
// }


MongoClient.connect(process.env.MONGO_URI,{useNewUrlParser: true},(err,client)=>{
    if(err){
        console.log(`Error: Unable to connect to the database ${err}`);
    } else {
        db =  client.db(dbName);
        dbClient = client;
        console.log(`Connected to the database: ${db}`);
    }
});


/* Get list of Todos */
todoRoutes.route('/').get((req,res)=>{
    //runDbSchemaValidation();
    db.collection("todos").find({}).toArray((err,docs)=>{
        if(err){
            console.log(err);
            //dbClient.close();
        } else {
            console.log(docs);
            res.json(docs);
        }
    });
});



/* Get Todo */
todoRoutes.route('/:id').get((req,res)=>{
    let todoID = req.params.id;
    //runDbSchemaValidation();
    db.collection("todos").findOne({_id: ObjectID(todoID)}, (err,docs)=>{
        if(err){
            console.log(err);
            //dbClient.close();
        }
        else {
            console.log(docs);
            res.json(docs);
        }
    });
});

/* Create Todo */
todoRoutes.route('/create').post((req,res,next)=>{
    const userInput = req.body;
    //runDbSchemaValidation();
    db.collection("todos").insertOne({description:userInput.description,responsible:userInput.responsible,priority:userInput.priority,completed:false},(err,docs)=>{
        if(err){
            console.log(err);
            //dbClient.close();
        }
        else{
            res.json(docs);
        }
    });
});

/* Edit todo */
todoRoutes.route('/edit/:id').get((req,res,next)=>{
    let todoID = req.params.id;
    //runDbSchemaValidation();
    db.collection("todos").findOne({_id: ObjectID(todoID)},(err,docs)=>{
        if(err){
            console.log(err);
            //dbClient.close();
        }
        else {
            console.log(docs);
            res.json(docs);
        }
    });
});

todoRoutes.route('/edit/:id').put((req,res,next)=>{
    const todoID = req.params.id;
    const userInput = req.body;
    //runDbSchemaValidation();
    db.collection("todos").updateOne({_id: ObjectID(todoID)},{ $set:{ description: userInput.description, responsible: userInput.responsible, priority: userInput.priority, completed: userInput.completed }},{returnNewDocument:true},(err,docs)=>{
        if(err){
            console.log(err);
            //dbClient.close();
        }
        else{
            res.json(docs);
            console.log(ObjectID(todoID));
        }
    });
});


/* Delete todo */
todoRoutes.route('/:id').delete((req,res,next)=>{
    const todoID = req.params.id;
    //runDbSchemaValidation();
    db.collection("todos").deleteOne({_id: ObjectID(todoID)},(err,docs)=>{
        if(err)
            console.log(err)
            //dbClient.close();
        else{
            res.json(docs);
        }
    });
});

app.use('/',todoRoutes);


app.listen(port,()=>{
    console.log(`Server listening to port ${port}`);
});





