import { ObjectId } from "mongodb";


export interface Animal {
        _id?: string;
        id: number;
        name: string;
        description: string;
        age: number;
        gender: "Male" | "Female";
        isEndangered: boolean;
        birthDate: Date;
        imageUrl: string;
        species: string;
        food: string[];
        habitat: Habitat;
    }

export interface Habitat {
    _id?: string,
    id: number;
    name: string;
    location: string;
    area: string;
    hasWaterFeature: boolean;
    imageHabitat: string;
    }

export interface User {
    _id?: ObjectId;
    username: string;
    password?: string;
    role: "ADMIN" | "USER";
    }

export interface FlashMessage {
    type: "error" | "success"
    message: string;
    }