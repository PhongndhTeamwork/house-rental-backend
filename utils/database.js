import dotenv from "dotenv";
import knex from "knex";

dotenv.config();

export const database = knex({
    client: "mysql2",
    connection: {
        host: process.env.HOST,
        port: process.env.MYSQL_PORT,
        user: process.env.USER,
        password: process.env.PASSWORD,
        database: process.env.DATABASE,
    },
});
