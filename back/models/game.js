import { Db } from "./db.js";

export class GameModal extends Db{

    static db = this.getClient().db("test");

    static collection = this.db.collection("games");

}
