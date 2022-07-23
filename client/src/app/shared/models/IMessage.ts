import {IUser} from "./IUser";

export interface IMessage {
    createdAt: Date;
    content: string;
    creator: IUser | null;
    room: string;
    _id: string;
    isSystemMessage: boolean;
    read: string[];
}
