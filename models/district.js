import { database } from "../utils/database.js";

export class District {
    static async getAllDistricts() {
        try {
            const districts = await database.select("*").from("districts");
            return districts;
        } catch (err) {
            return null;
        }
    }
}