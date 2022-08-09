import { IUser } from "./IUser";
import { Observable } from "rxjs";

export interface IRoom {
  _id: string;
  title: string;
  users: IUser[];
  creator: IUser | null;
  index: number;
  unread: number;
  lastAction: Date;
  isPublic: boolean;
  isFavorites: boolean;
}
