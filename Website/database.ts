import dotenv from "dotenv";
import { MongoClient, SortDirection } from "mongodb";
import { User, Animal, Habitat } from "./types";
import bcrypt from "bcrypt";
dotenv.config();

const saltRounds : number = 10;

export const MONGODB_URI = process.env.MONGODB_URI ?? "mongodb://localhost:27017";
export const client = new MongoClient(MONGODB_URI);

export const userCollection = client.db("Zoo").collection<User>("users");
export const animalCollection = client.db("Zoo").collection<Animal>("animals");
export const habitatCollection = client.db("Zoo").collection<Habitat>("habitats");

export async function getAnimals(q: string, sortField: string, direction: number) {
        let SortDirection : SortDirection = direction as SortDirection;
        return await animalCollection.find({name: new RegExp(q, "i")}).sort({[sortField]: SortDirection}).toArray();
}

export async function getAnimalById(id: number){

    return await animalCollection.findOne({ id: id }); 
}

export async function getHabitats() {
    return habitatCollection.find({}).toArray();
}

export async function getHabitatById(id: number){

    return await habitatCollection.findOne({ id: id }); 
}

export async function getAnimalsInHabitat(id : number){
    return await animalCollection.find<Animal>({"habitat.id" : id}).toArray();
}   

async function loadAnimalsToDatabase() {
    let animals = await animalCollection.find({}).toArray();
    if (animals.length === 0) {
        let animalsResponse = await fetch("https://raw.githubusercontent.com/Luckyrune5/ZooData/main/Animals.json");
        let animalsData : Animal[] = await animalsResponse.json() as Animal[];
        let result = await animalCollection.insertMany(animalsData);
        console.log("Animals added to MongoDB");
    }
    else{
        console.log("Animals already present");
    }
}

async function loadHabitatsToDatabase() {
    let habitats = await habitatCollection.find({}).toArray();
    if (habitats.length === 0) {
        let habitatsResponse = await fetch("https://raw.githubusercontent.com/Luckyrune5/ZooData/main/Habitats.json");
        let habitatsData : Habitat[] = await habitatsResponse.json() as Habitat[];
        let result = await habitatCollection.insertMany(habitatsData);
        console.log("Habitats added to MongoDB");
    }
    else{
        console.log("Habitats already present");
    }
}

async function createAdminUser() {
    if (await userCollection.countDocuments() > 0) {
        return;
    }
    let usernameAdmin : string | undefined = process.env.ADMIN_USERNAME;
    let passwordAdmin : string | undefined = process.env.ADMIN_PASSWORD;

    if (usernameAdmin === undefined || passwordAdmin === undefined) {
        throw new Error("Username and password for admin must be set in environment");
    }
    await userCollection.insertOne({
        username: usernameAdmin,
        password: await bcrypt.hash(passwordAdmin, saltRounds),
        role: "ADMIN"
    });
    let usernameUser : string | undefined = process.env.USER_USERNAME;
    let passwordUser : string | undefined = process.env.USER_PASSWORD;
    if (usernameUser === undefined || passwordUser === undefined) {
        throw new Error("Username and password for user must be set in environment");
    }
    await userCollection.insertOne({
        username: usernameUser,
        password: await bcrypt.hash(passwordUser, saltRounds),
        role: "USER"
    });
}

export async function edit(id : number, name : string, age : number, description: string, gender : "Male" | "Female") {
    await animalCollection.updateOne({id : id }, { $set: {name : name, age : age, description : description, gender : gender}});
}

export async function register(username : string, password : string) {
    if (username === "" || password === "") {
        throw new Error("Username and password must be filled");
    }
    let user : User | null = await userCollection.findOne({username : username});
    if (user) {
        throw new Error("Username already exists");
    }

    return await userCollection.insertOne({
        username: username,
        password: await bcrypt.hash(password, saltRounds),
        role: "USER"
    });
    }




export async function login(username: string, password: string) {
    if (username === "" || password === "") {
        throw new Error("Username and password required");
    }
    let user : User | null = await userCollection.findOne<User>({username: username});
    if (user) {
        if (await bcrypt.compare(password, user.password!)) {
            return user;
        } else {
            throw new Error("Password incorrect");
        }
    } else {
        throw new Error("User not found");
    }
}

export async function connect() {
    try {
        await client.connect();
        await loadAnimalsToDatabase();
        await loadHabitatsToDatabase();
        await createAdminUser();
        console.log("Connected to database");
    } catch (error) {
        console.error(error);
    }
    process.on("SIGINT", exit);
}

async function exit() {
    try {
        await client.close();
        console.log("Disconnected from database");
    } catch (error) {
        console.error(error);
    }
    process.exit(0);
}