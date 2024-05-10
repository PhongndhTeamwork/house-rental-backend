import constants from "../utils/constants.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config({ path: "config/.env" });

export default (req, res, next) => {
    // if (!req.session.isLoggedIn) {
    //     return res.status(401).send(constants.UNAUTHORIZED_MESSAGE);
    // }
    const authHeader = req.get("Authorization");
    if (!authHeader) {
        res.status(401).send(constants.UNAUTHORIZED_MESSAGE);
    }
    const token = authHeader.split(" ")[1];
    let decodedToken;
    try {
        decodedToken = jwt.verify(token, process.env.JWT_KEY);
    } catch (error) {
        res.status(500).send(constants.UNAUTHORIZED_MESSAGE);
    }
    if (!decodedToken) {
        res.status(401).send(constants.UNAUTHORIZED_MESSAGE);
    }
    req.id = decodedToken.id;
    next();
};
