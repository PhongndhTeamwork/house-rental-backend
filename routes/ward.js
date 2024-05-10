import express from "express";
import { getAllWards } from "../controllers/ward.js";

const router = express.Router();
router.get("/", getAllWards);

export { router as routes };
