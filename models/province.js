import { database } from "../utils/database.js";

export class Province {
    static async getAllProvinces() {
        try {
            const provinces = await database.select("*").from("provinces");
            return provinces;
        } catch (err) {
            return null;
        }
    }
}
