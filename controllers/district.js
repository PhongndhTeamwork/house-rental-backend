import { District } from "../models/district.js";
import { cache } from "../app.js";

export const getAllDistricts = async (req, res, next) => {
    let districts = cache.get("districts");
    if (!districts) {
      districts = await District.getAllDistricts();
        cache.set("districts", districts);
        console.log("Get districts from database");
    }
    console.log("Get districts from cache");
    res.status(200).json(districts);
};
