import express, { Express } from "express";
import dotenv from "dotenv";
import path from "path";
import { Animal, Habitat, User } from "./types";
import {connect, getAnimals, getHabitats, login} from "./database";
import session from "./session";
import { secureMiddleware } from "./middleware/secureMiddleware";
import { detailAnimalRouter } from "./router/detailAnimalRouter";
import { detailHabitatRouter } from "./router/detailHabitatRouter";
import { loginRouter } from "./router/loginRouter";
import { habitatsRouter } from "./router/habitatsRouter";
import { indexRouter } from "./router/indexRouter";
import { registerRouter } from "./router/registerRouter";
import { editRouter } from "./router/editRouter";
import { flashMiddleware } from "./middleware/flashMiddleware";

dotenv.config();

const app : Express = express();

app.set("view engine", "ejs");
app.use(express.json());
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.use(session);

app.set("port", process.env.port || 3001);

app.use(flashMiddleware);
app.use(loginRouter());
app.use(registerRouter());
app.use(indexRouter());
app.use(detailAnimalRouter());
app.use(detailHabitatRouter());
app.use(habitatsRouter());
app.use(editRouter());

app.listen(app.get("port"), async() => {
    try {
        await connect();
        console.log("Server started on http://localhost:" + app.get('port'));
    } catch (e) {
        console.log(e);
        process.exit(1); 
    }
});