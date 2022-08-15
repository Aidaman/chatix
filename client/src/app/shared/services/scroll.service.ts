import { Injectable } from "@angular/core";
import { BehaviorSubject, Subject } from "rxjs";

@Injectable({
  providedIn: "root"
})
export class ScrollService {
  public previousRoomId: BehaviorSubject<string> = new BehaviorSubject<string>("common");

  /*
  * @description a subject that used to save/load the scroll position
  * @description contain ir of the room that user switched to
  */
  public roomSwitched: Subject<{ roomId: string }> = new Subject<{ roomId: string }>();
  /*
  * @description a subject to track new messages, used in room component to set scrollbar to the down if needed
  */
  public scrollDown$: Subject<boolean> = new Subject<boolean>();

  constructor() { }
}
