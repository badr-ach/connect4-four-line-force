import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import {UserModal} from "../models/user.js";

export const secret = 'jwtS124';

export const login = async (req, res) => {
    const { mail, username, password } = req.body;

    try {

        let oldUser = null;

        if(mail){
            oldUser = await UserModal.findOne({ mail });
        }else if(username){
            oldUser = await UserModal.findOne({ username });
        }else{
            return res.status(404).json({ message: "Missing fields" });
        }

        if (!oldUser) return res.status(404).json({ message: "User doesn't exist" });

        const isPasswordCorrect = await bcrypt.compare(password, oldUser.password);

        if (!isPasswordCorrect) return res.status(400).json({ message: "Invalid credentials" });

        const data = oldUser;

        delete data.password;

        const token = jwt.sign({ mail: oldUser.mail, id: oldUser._id }, secret, { expiresIn: "1h" });

        res.status(200).json({ user: data, token: token });
        
    } catch (err) {
        res.status(500).json({ message: "Something went wrong" });
    }
};

export const signin = async (req, res) => {
    const { mail, password, username } = req.body;

    try {
        const oldUser = await UserModal.findOne({ mail });

        if (oldUser) return res.status(400).json({ message: "User already exists in the users list" });

        const hashedPassword = await bcrypt.hash(password, 12);

        const result = await UserModal.create({ mail, password: hashedPassword, username });

        const data = result;

        delete data.password;

        const token = jwt.sign({ mail: result.mail, id: result._id }, secret, { expiresIn: "1h" });

        res.status(201).json({ user: data, token: token });
        console.log("registered successfully");


    } catch (error) {
        res.status(500).json({ message: "Something went wrong" });

        console.log(error);
    }
};



export const loadUser = async (req,res) =>{
    try{
        const oldUser = await UserModal.findById(req.userId);

        if (!oldUser) return res.status(404).json({ message: "User doesn't exist" });

        const data = oldUser;

        delete data.password;


        res.status(200).json({ user: data });
    }catch (err){
        res.status(500).json({ message: "Something went wrong" });
    }
}