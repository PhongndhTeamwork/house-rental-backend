import express from "express";
import { signup, login, logout, autoLogin } from "../controllers/auth.js";

const router = express.Router();

router.post("/signup", signup);

router.get("/login", login);

router.get("/auto-login", autoLogin);

router.post("/logout", logout);

export { router as routes };
