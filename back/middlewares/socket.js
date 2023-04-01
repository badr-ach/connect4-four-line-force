import jwt from "jsonwebtoken";
import { secret } from "../controllers/user.js";

const auth = async (socket, next) => {

  try {
    const token = socket.handshake.auth.token;
    if(token === "guest"){
      socket.username = "guest";
      return next();
    }

    let decodedData;

    if (token) {
      decodedData = jwt.verify(token, secret);
      socket.handshake.auth.id = decodedData?.id;
      socket.username = decodedData?.username;
    }

    if(!decodedData) {
      console.log("in error", decodedData)
      console.log("in error token", token)
      return next(new Error("Invalid token"));
    }

    next();

  } catch (error) {

    console.log("in error two" + error)
    next(new Error("Unexpected error" + error));
  }
};

export default auth;
