import { IUser } from "./IUser";
import { Observable } from "rxjs";

export interface IRoom {
  _id: string;
  title: string;
  users: IUser[];
  creator: IUser | null;
  unread: number;
  lastAction: Date;
  isPublic: boolean;
  isFavorites: boolean;
}
