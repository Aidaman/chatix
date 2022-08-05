import { IUser } from "./IUser";

export interface IRoom {
    _id: string;
    title: string;
    users: IUser[];
    creator: IUser | null;
    index: number;
    lastAction: Date;
    isPublic: boolean;
    isFavorites: boolean;
}
