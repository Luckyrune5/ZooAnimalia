import { render } from "ejs";
import express from "express";
import { getAnimalById } from "../database";
import { Animal } from "../types";
import { parse } from "dotenv";
import { secureMiddleware } from "../middleware/secureMiddleware";

export function detailAnimalRouter() {
    const router = express.Router();

    router.get("/detailAnimal/:id", secureMiddleware, async(req, res) => {
        let animal : Animal | null = await getAnimalById(parseInt(req.params.id));
        res.render("detailAnimal", { 
            animal: animal
        });
    });
    return router;
}