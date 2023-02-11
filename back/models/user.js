import { Db } from "./db.js";

export class UserModal extends Db{

    static db = this.getClient().db("test");

    static collection = this.db.collection("users");

}
