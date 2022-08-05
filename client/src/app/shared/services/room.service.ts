import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class RoomService {
  public emoji: BehaviorSubject<string> = new BehaviorSubject<string>(" ");
  public sideMenuOpened: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  constructor() {}
}
