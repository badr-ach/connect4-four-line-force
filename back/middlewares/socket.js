import jwt from "jsonwebtoken";
import { secret } from "../controllers/user.js";

const auth = async (socket, next) => {

  try {
    const token = socket.handshake.auth.token;
    const isCustomAuth = token.length < 500;

    let decodedData;
    
    if (token && isCustomAuth) {      
      decodedData = jwt.verify(token, secret);
      socket.handshake.auth.id = decodedData?.id;
    } else {
      decodedData = jwt.decode(token);
      socket.handshake.auth.id = decodedData?.sub;
    }    

    if(!decodedData) {
        return next(new Error("Invalid token"));
    }

    next();

  } catch (error) {

    next(new Error("Unexpected error" + error));
  }
};

export default auth;