import { MongoClient } from "mongodb";
import { ObjectId } from "mongodb";

const uri =
"mongodb://admin:admin@mongodb:27017/admin?directConnection=true";

export class Db{
    static client = null;

    static getClient(){
        if(!this.client){
            this.client = new MongoClient(uri);
            this.client.connect();
            console.log("mongo created");
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

    static async findAll(query){
        try{
            return await this.collection.find(query).toArray();
        }catch(err){
            console.log(err);
        }
    }

    static async findById(id){
        try{
            return await this.collection.findOne({_id: new ObjectId(id)});
        }catch(err){
            console.log(err);
        }
    }

    static async last(query){
        try{
            return await this.collection.find(query).sort({_id:-1}).limit(1).toArray();
        }catch(err){
            console.log(err);
        }
    }

    static async updateOne(query, data){
        try{
            return await this.collection.updateOne(query, {$set: data});
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

