import { database } from "../utils/database.js";
import constants from "../utils/constants.js";
import { Pagination } from "./pagination.js";
import { cache } from "../app.js";
import { normalizeString } from "../utils/utils.js";

export class House {
    static async getAllHouses(res, pageSize, pageNumber) {
        try {
            const allHouses = await database
                .select("*")
                .from("houses")
                .orderBy("post_time", "desc");
            const startIndex = (pageNumber - 1) * pageSize;
            const endIndex = startIndex + pageSize;
            const houses = allHouses.slice(startIndex, endIndex);
            const pageTotal = Math.ceil(allHouses.length / pageSize);
            if (pageNumber == 1) cache.set("houses", allHouses); // Save houses to cache
            res.status(200).json(
                new Pagination(+pageSize, +pageNumber, pageTotal, houses)
            );
        } catch (err) {
            res.status(500).json(constants.SERVER_ERROR_MESSAGE);
        }
    }

    static getAllHousesFromCache(res, pageSize, pageNumber, houses) {
        const startIndex = (pageNumber - 1) * pageSize;
        const endIndex = startIndex + pageSize;
        const pageTotal = houses.length;
        houses = houses.slice(startIndex, endIndex);
        // houses.sort((a, b) => b.post_time - a.post_time);
        res.status(200).json(
            new Pagination(+pageSize, +pageNumber, pageTotal, houses)
        );
    }

    static async searchHouses(res, criteria, pageSize, pageNumber) {
        try {
            let provinces = await database
                .select("id")
                .from("provinces")
                .whereILike("name", `%${criteria}%`);
            let districts = await database
                .select("id")
                .from("districts")
                .whereILike("name", `%${criteria}%`);
            let wards = await database
                .select("id")
                .from("wards")
                .whereILike("name", `%${criteria}%`);
            provinces = provinces.map((province) => province.id);
            districts = districts.map((district) => district.id);
            wards = wards.map((ward) => ward.id);
            const allHouses = await database
                .select("*")
                .from("houses")
                .whereIn("province", provinces)
                .orWhereIn("district", districts)
                .orWhereIn("ward", wards)
                .orderBy("post_time", "desc");
            const startIndex = (pageNumber - 1) * pageSize;
            const endIndex = startIndex + pageSize;
            const houses = allHouses.slice(startIndex, endIndex);
            const pageTotal = Math.ceil(allHouses.length / pageSize);
            res.status(200).json(
                new Pagination(+pageSize, +pageNumber, pageTotal, houses)
            );
        } catch (error) {
            res.status(500).json(constants.SERVER_ERROR_MESSAGE);
        }
    }

    static searchHousesFromCache(
        res,
        criteria,
        pageSize,
        pageNumber,
        houses,
        provinces,
        districts,
        wards
    ) {
        provinces = provinces.filter((province) =>
            normalizeString(province.name).includes(normalizeString(criteria))
        );
        districts = districts.filter((district) =>
            normalizeString(district.name).includes(normalizeString(criteria))
        );
        wards = wards.filter((ward) =>
            normalizeString(ward.name).includes(normalizeString(criteria))
        );
        provinces = provinces.map((province) => province.id);
        districts = districts.map((district) => district.id);
        wards = wards.map((ward) => ward.id);
        houses = houses.filter(
            (house) =>
                provinces.includes(house.province) ||
                districts.includes(house.district) ||
                wards.includes(house.ward)
        );
        const startIndex = (pageNumber - 1) * pageSize;
        const endIndex = startIndex + pageSize;
        const pageTotal = Math.ceil(houses.length / pageSize);
        houses = houses.slice(startIndex, endIndex);
        // houses.sort((a, b) => b.post_time - a.post_time);
        res.status(200).json(
            new Pagination(+pageSize, +pageNumber, pageTotal, houses)
        );
    }

    static filterHouses(
        res,
        priceLowerBoundary,
        priceUpperBoundary,
        areaLowerBoundary,
        areaUpperBoundary,
        sortField,
        order,
        pageNumber,
        pageSize
    ) {
        // console.log(
        //     priceLowerBoundary,
        //     priceUpperBoundary,
        //     areaLowerBoundary,
        //     areaUpperBoundary,
        //     sortField,
        //     order
        // );
        database
            .select("*")
            .from("houses")
            .where(1, 1)
            .where((builder) => {
                if (priceLowerBoundary !== "null") {
                    builder.andWhere("price", ">=", priceLowerBoundary);
                }
                if (priceUpperBoundary !== "null") {
                    builder.andWhere("price", "<=", priceUpperBoundary);
                }
                if (areaLowerBoundary != "null") {
                    builder.andWhere("area", ">=", areaLowerBoundary);
                }
                if (areaUpperBoundary != "null") {
                    builder.andWhere("price", "<=", areaUpperBoundary);
                }
            })
            .orderBy(sortField, order)
            .then((allHouses) => {
                const startIndex = (pageNumber - 1) * pageSize;
                const endIndex = startIndex + pageSize;
                const houses = allHouses.slice(startIndex, endIndex);
                const pageTotal = Math.ceil(allHouses.length / pageSize);
                res.status(200).json(
                    new Pagination(+pageSize, +pageNumber, pageTotal, houses)
                );
            })
            .catch((err) => {
                console.error(err);
                res.status(500).json(constants.SERVER_ERROR_MESSAGE);
            });
    }
}
