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

    const {username} = req.body;

    try{

        const user = await UserModal.findById(req.userId);

        if (!user) return res.status(404).json({ message: "User doesn't exist" });

        const friend = await UserModal.findOne({ username : username });

        if (!friend) return res.status(404).json({ message: "User to befriend doesn't exist" });

        if(user.friends.includes(username)) return res.status(400).json({ message: "User is already a friend" });

        user.friends.push(username);

        user.incomingFriendRequests = user.incomingFriendRequests.filter((item) => item !== username);

        friend.friends.push(user.username);

        friend.outgoingFriendRequests = friend.outgoingFriendRequests.filter((item) => item !== user.username);

        await UserModal.updateOne({ _id: user._id }, { friends: user.friends, incomingFriendRequests: user.incomingFriendRequests });

        await UserModal.updateOne({ _id: friend._id }, { friends: friend.friends, outgoingFriendRequests: friend.outgoingFriendRequests });

        return res.status(200).json({ message: "Friend added", username : username });

    }catch(err){

        res.status(500).json({ message: "Something went wrong" });

    }
}

export const rejectfriend = async (req, res) => {

    const {username} = req.body;

    try{

        const user = await UserModal.findById(req.userId);

        if (!user) return res.status(404).json({ message: "User doesn't exist" });

        const friend = await UserModal.findOne({ username : username });

        if (!friend) return res.status(404).json({ message: "User to befriend doesn't exist" });

        if(user.friends.includes(username)) return res.status(400).json({ message: "User is already a friend" });

        user.incomingFriendRequests = user.incomingFriendRequests.filter((item) => item !== username);

        friend.outgoingFriendRequests = friend.outgoingFriendRequests.filter((item) => item !== user.username);

        await UserModal.updateOne({ _id: user._id }, { incomingFriendRequests: user.incomingFriendRequests });

        await UserModal.updateOne({ _id: friend._id }, { outgoingFriendRequests: friend.outgoingFriendRequests });

        return res.status(200).json({ message: "Friend request rejected", username : username });

    }catch(err){

            res.status(500).json({ message: "Something went wrong" });
    }
}


export const unfriend = async (req, res) => {

    const {username} = req.body;

    try{

        const user = await UserModal.findById(req.userId);

        if (!user) return res.status(404).json({ message: "User doesn't exist" });

        const friend = await UserModal.findOne({ username : username });

        if (!friend) return res.status(404).json({ message: "User to unfriend doesn't exist" });

        if(!user.friends.includes(username) || !friend.friends.includes(user.username)) return res.status(400).json({ message: "User is not your friend" });

        user.friends = user.friends.filter((item) => item !== username);
        
        friend.friends = friend.friends.filter((item) => item !== user.username);

        await UserModal.updateOne({ _id: user._id }, { friends: user.friends });

        await UserModal.updateOne({ _id: friend._id }, { friends: friend.friends });

        return res.status(200).json({ message: "Friend removed", username : username });

    }catch(err){
        res.status(500).json({ message: "Something went wrong" });
    }
}

export const history = async (req, res) => {
    try {
        
        const projection = { gameId: 1, playerOne: 1, playerTwo: 1,winner: 1};

        let history = await GameModal.findAll( {$or: [{ playerOne: req.username }, { playerTwo: req.username }]}, projection);

        res.status(200).json({ history: history });

    }catch (err){
        console.log("errrr ",err);
        res.status(500).json({ message: "Something went wrong" });
    }
}

export const profile = async (req, res) => {

    const {id} = req.params;

    try {

        const user = await UserModal.findById(id);

        if (!user) return res.status(404).json({ message: "User doesn't exist" });

        const projection = { gameId: 1, playerOne: 1, playerTwo: 1,winner: 1};

        let history = await GameModal.findAll( {$or: [{ playerOne: req.username }, { playerTwo: req.username }]}, projection);

        const data = { user : user, history: history }

        delete data.user.password;

        res.status(200).json({ profile: data });

    }catch (err){
        res.status(500).json({ message: "Something went wrong" });
    }
}