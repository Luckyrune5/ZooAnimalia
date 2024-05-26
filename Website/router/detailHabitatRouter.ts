import { render } from "ejs";
import express from "express";
import { getHabitatById, getAnimalsInHabitat } from "../database";
import { Habitat, Animal } from "../types";
import { parse } from "dotenv";
import { secureMiddleware } from "../middleware/secureMiddleware";

export function detailHabitatRouter() {
    const router = express.Router();

    router.get("/detailHabitat/:id",secureMiddleware , async(req, res) => {
        let habitatId : number = parseInt(req.params.id);
        let habitat : Habitat | null = await getHabitatById(habitatId);
        let animals : Animal[] = await getAnimalsInHabitat(habitatId);
        res.render("detailHabitat", { 
            habitat: habitat,
            animals: animals
        });
        
    });
    return router;
}