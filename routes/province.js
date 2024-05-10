import express from "express";
import { getAllProvinces } from "../controllers/province.js";

const router = express.Router();
router.get("/", getAllProvinces);

export { router as routes };
