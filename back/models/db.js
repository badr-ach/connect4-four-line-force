import { MongoClient } from "mongodb";

// Replace the uri string with your connection string.
const uri =
  "mongodb+srv://admin:admin@cluster0.sbr99rs.mongodb.net/?retryWrites=true&w=majority";


export class Db{
    static client = null;

    static getClient(){
        if(!this.client){
            this.client = new MongoClient(uri);
        }
        return this.client;
    }
}