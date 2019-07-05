const MongoClient = require("mongodb").MongoClient;
const ObjectID = require("mongodb").ObjectID;
const dotenv = require("dotenv");

dotenv.config({
	path: './.env'
})

const url = process.env.MONGO_URI;
const dbName = process.env.DB_NAME;
const client = new MongoClient(url,{useNewUrlParser:true});

const state = {
	db: null
}

const connect = (cb) =>{ /* callback */
	/* if there's a database connection */
	if(state.db){
		cb();
	} else {
		client.connect(function(err){
			//assert.equal(null,err);
			if(err){
				cb(err);
			} else {
        		state.db = client.db(dbName);
        		cb();
			}
		});
	}
}

/* Get the primary key based on the object id */ 
const getPrimaryKey = (_id)=>{
	return ObjectID(_id);
}

/* Get the database */
const getDB = ()=>{
	return state.db;
}

module.exports = { getDB, connect, getPrimaryKey};