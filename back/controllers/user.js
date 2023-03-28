import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import {UserModal} from "../models/user.js";

export const secret = 'jwtS124';

export const login = async (req, res) => {
    const { mail, username, password } = req.body;

    try {

        let oldUser = null;

        if(mail || username){
            oldUser = await UserModal.findOne({ $or: [{ mail }, { username }] });
        }else{
            return res.status(404).json({ message: "Missing fields" });
        }

        if (!oldUser) return res.status(404).json({ message: "User doesn't exist" });

        const isPasswordCorrect = await bcrypt.compare(password, oldUser.password);

        if (!isPasswordCorrect) return res.status(400).json({ message: "Invalid credentials" });

        const data = oldUser;

        delete data.password;

        const token = jwt.sign({ mail: oldUser.mail, username:oldUser.username, id: oldUser._id }, secret, { expiresIn: "1h" });

        res.status(200).json({ user: data, token: token });
        
    } catch (err) {

        res.status(500).json({ message: "Something went wrong" });
    }
};

export const signin = async (req, res) => {

    const { mail, password, username } = req.body;

    try {
        const oldUser = await UserModal.findOne({ mail });

        if (oldUser) return res.status(400).json({ message: "Email already exists in the users list" });

        const hashedPassword = await bcrypt.hash(password, 12);

        const result = await UserModal.create({ mail, password: hashedPassword, username, rating: 1000, friends: [], 
        outgoingFriendRequests: [], incomingFriendRequests: [] });

        const data = await UserModal.findOne( { username });

        delete data.password;

        const token = jwt.sign({ mail: data.mail, username:data.username, id: data._id }, secret, { expiresIn: "1h" });

        res.status(200).json({ user: data, token: token });

    } catch (error) {

        res.status(500).json({ message: "Something went wrong" });

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


export const befriend = async (req, res) => {

    const {friendId} = req.body;
    
    try{

        const user = await UserModal.findById(req.userId);

        if (!user) return res.status(404).json({ message: "User doesn't exist" });

        const friend = await UserModal.findById(friendId);

        if (!friend) return res.status(404).json({ message: "User to befriend doesn't exist" });

        if(user.friends.includes(friendId)) return res.status(400).json({ message: "User is already a friend" });

        user.friends.push(friendId);

        friend.friends.push(req.userId);

        await user.save();

        await friend.save();

    }catch(err){

        res.status(500).json({ message: "Something went wrong" });

    }
}