import { NextFunction, Request, Response } from "express";
import { User } from "../types";

export function adminMiddleware(req: Request, res: Response, next: NextFunction) {
    let user : User | undefined = req.session.user;
    if (user?.role === "ADMIN") {
        next();
    } else {
        res.redirect(`/detailAnimal/${req.params.id}`);
    }
};