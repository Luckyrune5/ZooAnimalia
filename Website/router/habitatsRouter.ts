import { render } from "ejs";
import express from "express";
import { getHabitats} from "../database";
import { User } from "../types";
import { parse } from "dotenv";
import { secureMiddleware } from "../middleware/secureMiddleware";

export function habitatsRouter() {
    const router = express.Router();

    router.get("/habitats", secureMiddleware, async(req, res) => {
            let allHabitats = await getHabitats();
            res.render("habitats", {
                allHabitats : allHabitats
            });

        
    });
    return router;
}