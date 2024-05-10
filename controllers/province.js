import { Province } from "../models/province.js";
import { cache } from "../app.js";

export const getAllProvinces = async (req, res, next) => {
    let provinces = cache.get("provinces");
    if (!provinces) {
        provinces = await Province.getAllProvinces();
        cache.set("provinces", provinces);
        console.log("Get provinces from database");
    }
    console.log("Get provinces from cache");
    res.status(200).json(provinces);
};
