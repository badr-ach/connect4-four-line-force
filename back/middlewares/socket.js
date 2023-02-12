import jwt from "jsonwebtoken";
import { secret } from "../controllers/user.js";

const auth = async (socket, next) => {

  try {
    const token = socket.handshake.auth.token;
    const isCustomAuth = token.length < 500;

    if(token === "guest"){
      socket.handshake.auth.id = "guest";
      return next();
    }

    let decodedData;
    
    if (token && isCustomAuth) {      
      decodedData = jwt.verify(token, secret);
      socket.handshake.auth.id = decodedData?.id;
    }    

    if(!decodedData) {
      console.log("in error")
      return next(new Error("Invalid token"));
    }

    next();

  } catch (error) {

    console.log("in error two" + error)
    next(new Error("Unexpected error" + error));
  }
};

export default auth;