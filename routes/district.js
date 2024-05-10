import express from "express";
import { getAllDistricts } from "../controllers/district.js";

const router = express.Router();
router.get("/", getAllDistricts);

export { router as routes };
