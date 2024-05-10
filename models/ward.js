import { database } from "../utils/database.js";

export class Ward {
    static async getAllWards() {
        try {
            const wards = await database.select("*").from("wards");
            return wards;
        } catch (err) {
            return null;
        }
    }
}
