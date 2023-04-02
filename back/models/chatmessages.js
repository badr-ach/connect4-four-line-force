import { Db } from "./db.js";

export class ChatModal extends Db{

    static db = this.getClient().db("test");

    static collection = this.db.collection("chat");

}
