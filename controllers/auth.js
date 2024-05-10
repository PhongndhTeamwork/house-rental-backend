import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import constants from "../utils/constants.js";
import { User } from "../models/user.js";
import jwt from "jsonwebtoken";

dotenv.config({ path: "config/.env" });

export const signup = (req, res) => {
    const { username, email, password, phone_number } = req.body;
    bcrypt
        .hash(password, 12)
        .then(async (hashedPassword) => {
            const newUser = new User(
                username,
                email,
                phone_number,
                hashedPassword
            );
            let isPresent = await newUser.checkUserIsPresent();
            switch (isPresent) {
                case -1:
                    return res.status(500).send(constants.SERVER_ERROR_MESSAGE);
                case 1:
                    return res
                        .status(400)
                        .send(constants.USERNAME_EXIST_MESSAGE);
                case 2:
                    return res.status(400).send(constants.EMAIL_EXIST_MESSAGE);
                case 0:
                    newUser.createUser(res);
            }
        })
        .catch((err) => {
            res.status(500).send(constants.SERVER_ERROR_MESSAGE);
        });
};

export const login = async (req, res) => {
    const { identifier, password } = req.body;
    const user = await User.findUser(res, identifier, password);
    const token = jwt.sign(user, process.env.JWT_KEY, { expiresIn: "2d" });
    // console.log(user);
    if (user) {
        // req.session.isLoggedIn = true;
        // req.session.user = user;
        res.status(200).json({ token: token, ...user });
    }
};

export const autoLogin = async (req, res) => {
    const authHeader = req.get("Authorization");
    if (!authHeader) {
        const error = new Error(constants.UNAUTHORIZED_MESSAGE);
        error.statusCode = 401;
        throw error;
    }
    const token = authHeader.split(" ")[1];
    let decodedToken;
    try {
        decodedToken = jwt.verify(token, process.env.JWT_KEY);
        delete decodedToken.iat;
        delete decodedToken.exp;
        res.status(200).json({ token: token, ...decodedToken });
    } catch (error) {
        res.status(500).json({ message: constants.UNAUTHORIZED_MESSAGE });
    }
};

export const logout = (req, res) => {
    // req.session.destroy((error) => {
    //     if (error) {
    //         res.status(500).send(constants.LOGOUT_FAIL_MESSAGE);
    //     } else {
    //         res.status(201).send(constants.LOGOUT_SUCCESS_MESSAGE);
    //     }
    // });
    res.status(201).send(constants.LOGOUT_SUCCESS_MESSAGE);
};
