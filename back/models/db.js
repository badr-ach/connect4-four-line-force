import { MongoClient } from "mongodb";

// Replace the uri string with your connection string.
const uri = "mongodb://localhost:27017";
  //"mongodb+srv://admin:admin@cluster0.sbr99rs.mongodb.net/?retryWrites=true&w=majority";


export class Db{
    static client = null;

    static getClient(){
        if(!this.client){
            this.client = new MongoClient(uri);
        }
        return this.client;
    }

    static async findOne(query){
        try{
            return await this.collection.findOne(query);
        }catch(err){
            console.log(err);
        }
    }

    static async create(data){
        try{
            return await this.collection.insertOne(data);
        }catch(err){
            console.log(err);
        }
    }
}
