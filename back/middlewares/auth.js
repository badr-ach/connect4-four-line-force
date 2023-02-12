import jwt from "jsonwebtoken";
import { secret } from "../controllers/user.js";

const auth = async (req, res, next) => {

  try {
    const token = req.headers.authorization.split(" ")[1];
    const isCustomAuth = token.length < 500;

    let decodedData;
    
    if (token && isCustomAuth) {      
      decodedData = jwt.verify(token, secret);

      req.userId = decodedData?.id;
    } 

    next();
  } catch (error) {
    console.log(error);
      res.status(400).json({message:'Invalid token'})
  }
};

export default auth;