import { render } from "ejs";
import express from "express";
import { getAnimals} from "../database";
import { User } from "../types";
import { parse } from "dotenv";
import { secureMiddleware } from "../middleware/secureMiddleware";
import path from "path";

export function indexRouter() {
    const router = express.Router();

    router.get("/", secureMiddleware, async(req, res) => {
            const q : string = typeof req.query.q === "string" ? req.query.q : "";
            const sortField: string = typeof req.query.sortField === "string" ? req.query.sortField : "id";
            const direction: number = typeof req.query.direction === "string" ? parseInt(req.query.direction) : 1;
            let allAnimals = await getAnimals(q, sortField, direction);
            res.render("index", {
                allAnimals : allAnimals,
                q: q,
                direction: direction
            });
            console.log(req.session.user);
        
    });
    return router;
}