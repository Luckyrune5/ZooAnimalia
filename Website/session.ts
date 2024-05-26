import { MONGODB_URI } from "./database";
import session, { MemoryStore } from "express-session";
import { User, FlashMessage } from "./types";
import mongoDbSession from "connect-mongodb-session";
const MongoDBStore = mongoDbSession(session);

const mongoStore = new MongoDBStore({
    uri: MONGODB_URI,
    collection: "sessions",
    databaseName: "Zoo",
});

declare module 'express-session' {
    export interface SessionData {
        user?: User;
        message?: FlashMessage;
    }
}

export default session({
    secret: process.env.SESSION_SECRET ?? "my-super-secret-secret",
    store: mongoStore,
    resave: true,
    saveUninitialized: true
});