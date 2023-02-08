import jwt from "jsonwebtoken";

import UserModal from "../models/user.js";

const secret = 'jwtS124';

export const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const oldUser = await UserModal.findOne({ email });

        if (!oldUser) return res.status(404).json({ message: "User doesn't exist" });

        const isPasswordCorrect = await bcrypt.compare(password, oldUser.password);

        if (!isPasswordCorrect) return res.status(400).json({ message: "Invalid credentials" });

        const data = oldUser;

        delete data.password;

        const token = jwt.sign({ email: oldUser.email, id: oldUser._id }, secret, { expiresIn: "1h" });

        res.status(200).json({ user: data, token: token });
    } catch (err) {
        res.status(500).json({ message: "Something went wrong" });
    }
};

export const signin = async (req, res) => {
    const { email, password, give_name, family_name } = req.body;

    try {
        const oldUser = await UserModal.findOne({ email });

        if (oldUser) return res.status(400).json({ message: "User already exists" });

        const hashedPassword = await bcrypt.hash(password, 12);

        const result = await UserModal.create({ email, password: hashedPassword, name: `${give_name} ${family_name}`,family_name:family_name,given_name:given_name });

        const data = result;

        delete data.password;

        const token = jwt.sign({ email: result.email, id: result._id }, secret, { expiresIn: "1h" });

        res.status(201).json({ user: data, token: token });
    } catch (error) {
        res.status(500).json({ message: "Something went wrong" });

        console.log(error);
    }
};
