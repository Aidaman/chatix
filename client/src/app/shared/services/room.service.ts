import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import {IMessage} from "../models/IMessage";

@Injectable({
  providedIn: "root",
})
export class RoomService {
  public emoji: BehaviorSubject<string> = new BehaviorSubject<string>(" ");
  public sideMenuOpened: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public messagesInCommon: BehaviorSubject<IMessage[]> = new BehaviorSubject<IMessage[]>([]);

  constructor() {}
}
