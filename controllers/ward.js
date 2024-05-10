import { Ward } from "../models/ward.js";
import { cache } from "../app.js";

export const getAllWards = async (req, res, next) => {
    let wards = cache.get("wards");
    if (!wards) {
      wards = await Ward.getAllWards();
        cache.set("wards", wards);
        console.log("Get wards from database");
    }
    console.log("Get wards from cache");
    res.status(200).json(wards);
};
