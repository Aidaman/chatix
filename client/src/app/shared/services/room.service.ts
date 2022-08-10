import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { IMessage } from "../models/IMessage";

@Injectable({
  providedIn: "root",
})
export class RoomService {
  public emoji: BehaviorSubject<string> = new BehaviorSubject<string>(" ");
  public messagesInCommon: BehaviorSubject<IMessage[]> = new BehaviorSubject<IMessage[]>([]);

  constructor() {}

  public editMessageInCommon(messageId: string, correction: string): void {
    const newMessagesArray = this.messagesInCommon.value.map((message) => {
      if (message._id === messageId) {
        message = { ...message, content: correction };
      }
      return message;
    });

    this.messagesInCommon.next(newMessagesArray);
  }

}
