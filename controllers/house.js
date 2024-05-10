import { House } from "../models/house.js";
import { cache } from "../app.js";
import constants from "../utils/constants.js";
import { User } from "../models/user.js";

export const getAllHouses = async (req, res) => {
    let { pageSize, pageNumber } = req.query;
    if (!Number.isInteger(+pageSize) || +pageSize < 1)
        pageSize = constants.PAGE_SIZE;
    if (!Number.isInteger(+pageNumber) || +pageNumber < 1) pageNumber = 1;
    const houses = cache.get("houses");
    if (!houses) {
        console.log("Get from database");
        return await House.getAllHouses(res, pageSize, pageNumber);
    }
    console.log("Get from cache");
    House.getAllHousesFromCache(res, pageSize, pageNumber, houses);
};

export const searchHouses = async (req, res) => {
    let { pageSize, pageNumber } = req.query;
    const { criterion } = req.body;
    if (!Number.isInteger(+pageSize) || +pageSize < 1)
        pageSize = constants.PAGE_SIZE;
    if (!Number.isInteger(+pageNumber) || +pageNumber < 1) pageNumber = 1;
    const houses = cache.get("houses");
    const provinces = cache.get("provinces");
    const districts = cache.get("districts");
    const wards = cache.get("wards");
    if (!houses || !provinces || !districts || !wards) {
        console.log("Search from database");
        return await House.searchHouses(res, criterion, pageSize, pageNumber);
    }
    console.log("Search from cache");
    House.searchHousesFromCache(
        res,
        criterion,
        pageSize,
        pageNumber,
        houses,
        provinces,
        districts,
        wards
    );
};

export const filterHouses = (req, res) => {
    let { pageSize, pageNumber } = req.query;
    if (!Number.isInteger(+pageSize) || +pageSize < 1)
        pageSize = constants.PAGE_SIZE;
    if (!Number.isInteger(+pageNumber) || +pageNumber < 1) pageNumber = 1;
    const {
        priceLowerBoundary,
        priceUpperBoundary,
        areaLowerBoundary,
        areaUpperBoundary,
        sortField,
        order,
    } = req.query;
    House.filterHouses(
        res,
        priceLowerBoundary,
        priceUpperBoundary,
        areaLowerBoundary,
        areaUpperBoundary,
        sortField,
        order,
        pageNumber,
        pageSize
    );
};

export const saveNews = (req, res) => {
    const { house_id } = req.body;
    User.saveNews(res, req.id, house_id);
};

export const getSavedNews = (req, res) => {
    User.getSavedNews(res, req.id);
};

export const reportBadNews = (req, res) => {
    const { house_id, content, name, email, phone_number } = req.body;
    User.reportBadNews(res, house_id, content, name, email, phone_number);
};

export const getAllWarnings = (req, res) => {
    const { confirm } = req.query;
    User.getAllWarnings(res, confirm);
};

export const getWarningsOfEachHouse = (req, res) => {
    const { confirm } = req.query;
    const { house_id } = req.params;
    User.getWarningOfEachHouse(res, house_id, confirm);
};
