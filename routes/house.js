import express from "express";
import {
    filterHouses,
    getAllHouses,
    getAllWarnings,
    getSavedNews,
    getWarningsOfEachHouse,
    reportBadNews,
    saveNews,
    searchHouses,
} from "../controllers/house.js";
import isAuth from "../middlewares/is-auth.js";

const router = express.Router();

router.get("/get-all-houses", getAllHouses);

router.get("/search-houses", searchHouses);

router.get("/filter-houses", filterHouses);

router.get("/saved-news", isAuth, getSavedNews);

router.post("/save-news", isAuth, saveNews);

router.get("/all-warnings", getAllWarnings);

router.get("/warning/:house_id", getWarningsOfEachHouse);

router.post("/report-bad-news", reportBadNews);




export { router as routes };
