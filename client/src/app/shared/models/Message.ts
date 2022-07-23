import {User} from "./User";

export interface Message {
    createdAt: Date;
    content: string;
    creator: User | null;
    room: string;
    _id: string;
    isSystemMessage: boolean;
    read: string[];
}
