import { Db } from "./db.js";

export class UserModal{

    static client = Db.getClient();

    static db = this.client.db("test");

    static collection = this.db.collection("users");

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