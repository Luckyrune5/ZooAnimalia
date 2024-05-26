import { render } from "ejs";
import express from "express";
import { register} from "../database";
import { User } from "../types";
import { parse } from "dotenv";

export function registerRouter() {
    const router = express.Router();

    router.get("/register", (req, res) => {
        res.render("register");
    });

    router.post("/register", async(req, res) => {
        const username : string = req.body.username;
        const password : string = req.body.password;
        try {
            await register(username, password);;
            res.redirect("/login")
        } catch (e : any) {
            req.session.message = {type: "error", message: e.message}
            res.redirect("/register");
        }
    });

    return router;
}