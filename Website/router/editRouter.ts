import { render } from "ejs";
import express from "express";
import { getAnimalById, edit } from "../database";
import { Animal } from "../types";
import { parse } from "dotenv";
import { secureMiddleware } from "../middleware/secureMiddleware";
import { adminMiddleware } from "../middleware/adminMiddleware";

export function editRouter() {
    const router = express.Router();

    router.get("/edit/:id", secureMiddleware, adminMiddleware, async(req, res) => {
        let animal : Animal | null = await getAnimalById(parseInt(req.params.id));
        res.render("edit", { 
            animal: animal
        });
    });

    router.post("/edit/:id", async(req, res) => {
        const name : string = req.body.name;
        const age : number = req.body.age;
        const description : string = req.body.description;
        const gender : "Male" | "Female" = req.body.gender;
        const id : number = parseInt(req.params.id);

        await edit(id, name, age, description, gender);
        res.redirect(`/detailAnimal/${id}`)

    });

    return router;
}