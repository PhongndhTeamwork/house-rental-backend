import { database } from "../utils/database.js";
import constants from "../utils/constants.js";
import bcrypt from "bcryptjs";

export class User {
    constructor(name, email, phone_number, hashedPassword) {
        this.name = name;
        this.email = email;
        this.phone_number = phone_number;
        this.hashedPassword = hashedPassword;
    }
    

    async checkUserIsPresent() {
        //* Return 0 if user does not exist
        //* Return -1 if there is server error
        //* Return 1 if username already exists
        //* Return 2 if email already exists
        try {
            const usersFoundByName = await database
                .select("*")
                .from("users")
                .where("username", "=", this.name);

            if (usersFoundByName.length > 0) {
                return 1;
            }

            const usersFoundByEmail = await database
                .select("*")
                .from("users")
                .where("email", "=", this.email);

            if (usersFoundByEmail.length > 0) {
                return 2;
            } else {
                return 0;
            }
        } catch (err) {
            // console.error(err);
            return -1;
        }
    }

    createUser(res) {
        database
            .transaction((trx) => {
                trx.insert({
                    username: this.name,
                    email: this.email,
                    phone_number: this.phone_number,
                })
                    .into("users")
                    .then(() => {
                        trx("logins")
                            .insert({
                                username: this.name,
                                email: this.email,
                                password: this.hashedPassword,
                            })
                            .then(() => {
                                // res.json({
                                //     username: this.name,
                                //     email: this.email,
                                //     phone_number: this.phone_number,
                                // });
                                res.json(constants.SIGNUP_SUCCESS_MESSAGE);
                            })
                            .catch(() => {
                                // console.error(err);
                                res.status(500).json(
                                    constants.SERVER_ERROR_MESSAGE
                                );
                            });
                    })
                    .then(trx.commit)
                    .catch(() => {
                        // console.error(err);
                        trx.rollback;
                        res.status(500).json(constants.SERVER_ERROR_MESSAGE);
                    });
            })
            .catch(() => {
                // console.error(err);
                res.status(500).json(constants.SERVER_ERROR_MESSAGE);
            });
    }

    static async findUser(res, identifier, password) {
        try {
            let login = await database
                .select("*")
                .from("logins")
                .where("username", "=", identifier)
                .orWhere("email", "=", identifier);
            if (login.length > 0) {
                let isMatch = await bcrypt.compare(password, login[0].password);
                if (isMatch) {
                    console.log(isMatch);
                    let users = await database
                        .select("*")
                        .from("users")
                        .where("username", "=", identifier)
                        .orWhere("email", "=", identifier);
                    // console.log(users[0]);
                    return users[0];
                } else {
                    res.status(500).json(constants.LOGIN_FAIL_MESSAGE);
                    return null;
                }
            } else {
                res.status(500).json(constants.LOGIN_FAIL_MESSAGE);
                return null;
            }
        } catch (err) {
            res.status(500).json(constants.SERVER_ERROR_MESSAGE);
            return null;
        }
    }

    static saveNews(res, user_id, house_id) {
        database
            .insert({
                user_id: user_id,
                house_id: house_id,
            })
            .into("favourites")
            .then(() => {
                res.status(201).json(constants.SUCCESS_MESSAGE);
            })
            .catch((err) => {
                if (err.code === "ER_DUP_ENTRY") {
                    return res
                        .status(500)
                        .json(
                            constants.SERVER_DUPLICATE_UNIQUE_CONSTRAINT_MESSAGE
                        );
                }
                res.status(500).json(constants.SERVER_ERROR_MESSAGE);
            });
    }

    static getSavedNews(res, user_id) {
        database
            .select("houses.*")
            .from("houses")
            .join("favourites", "favourites.house_id", "houses.id")
            .join("users", "users.id", "favourites.user_id")
            .where("favourites.user_id", "=", user_id)
            .then((houses) => {
                res.status(200).json(houses);
            })
            .catch(() => {
                res.status(500).json(constants.SERVER_ERROR_MESSAGE);
            });
    }

    static reportBadNews(res, house_id, content, name, email, phone_number) {
        database
            .transaction((trx) => {
                trx.insert({
                    house_id,
                    content,
                    name,
                    email,
                    phone_number,
                })
                    .into("warnings")
                    .then(() => {
                        trx("houses")
                            .update({
                                warning: true,
                            })
                            .where({ id: house_id })
                            .then(() => {
                                trx.commit();
                                res.status(201).json(constants.SUCCESS_MESSAGE);
                            })
                            .catch((err) => {
                                trx.rollback();
                                res.status(500).json(
                                    constants.SERVER_ERROR_MESSAGE
                                );
                            });
                    })
                    .catch((err) => {
                        res.status(500).json(constants.SERVER_ERROR_MESSAGE);
                    });
            })
            .catch((err) => {
                res.status(500).json(constants.SERVER_ERROR_MESSAGE);
            });
    }

    static getAllWarnings(res, confirm) {
        database
            .select("*")
            .from("warnings")
            .where((builder) => {
                if (confirm === "true") {
                    builder.where("confirm", true);
                } else if (confirm === "false") {
                    builder.where("confirm", false);
                } else {
                    builder.whereNull("confirm");
                }
            })
            .then((warning) => {
                res.status(200).json(warning);
            })
            .catch(() => {
                res.status(500).json(constants.SERVER_ERROR_MESSAGE);
            });
    }

    static getWarningOfEachHouse(res, house_id, confirm) {
        database
            .select("*")
            .from("warnings")
            .where("house_id", "=", house_id)
            .andWhere((builder) => {
                if (confirm === "true") {
                    builder.where("confirm", true);
                } else if (confirm === "false") {
                    builder.where("confirm", false);
                } else {
                    builder.whereNull("confirm");
                }
            })
            .then((warnings) => {
                res.status(200).json(warnings);
            })
            .catch((err) => {
                console.log(err);
                res.status(500).json(constants.SERVER_ERROR_MESSAGE);
            });
    }
}
