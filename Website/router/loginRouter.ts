import { render } from "ejs";
import express from "express";
import { login} from "../database";
import { User } from "../types";
import { parse } from "dotenv";
import { loginMiddleware } from "../middleware/loginMiddleware";

export function loginRouter() {
    const router = express.Router();

    router.get("/login", loginMiddleware, (req, res) => {
        res.render("login");
    });

    router.post("/login", async(req, res) => {
        const username : string = req.body.username;
        const password : string = req.body.password;
        try {
            let user : User = await login(username, password);
            delete user.password; 
            req.session.user = user;
            res.redirect("/")
        } catch (e : any) {
            req.session.message = {type: "error", message: e.message};
            res.redirect("/login");
        }
    });

    router.post("/logout", async (req, res) => {
        req.session.destroy((err) => {
            res.redirect("/login");
        });
    });
    return router;
}