import express from "express";
import bodyParser from "body-parser";
import { fileURLToPath } from "url";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import NodeCache from "node-cache";
import { routes as authRoutes } from "./routes/auth.js";
import { routes as adminRoutes } from "./routes/admin.js";
import { routes as errorRoutes } from "./routes/error.js";
import { routes as houseRoutes } from "./routes/house.js";
import { routes as provinceRoutes } from "./routes/province.js";
import { routes as districtRoutes } from "./routes/district.js";
import { routes as wardRoutes } from "./routes/ward.js";

import { Province } from "./models/province.js";
import { District } from "./models/district.js";
import { Ward } from "./models/ward.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "public")));
app.use(
    cors({
        credentials: true,
    })
);

export const cache = new NodeCache();


app.use("/admin", adminRoutes);
app.use(authRoutes);
app.use(houseRoutes);
app.use("/province", provinceRoutes);
app.use("/district", districtRoutes);
app.use("/ward", wardRoutes);
app.use(errorRoutes);

const provinces = await Province.getAllProvinces();
const districts = await District.getAllDistricts();
const wards = await Ward.getAllWards();
cache.set("provinces", provinces);
cache.set("districts", districts);
cache.set("wards", wards);
app.listen(process.env.PORT);


