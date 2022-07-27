import {Injectable} from "@angular/core";
import {BehaviorSubject} from "rxjs";
import {IMessage} from "../models/IMessage";
import {ChatService} from "./chat.service";

@Injectable({
    providedIn: 'root',
})
export class RoomService{
    public message: BehaviorSubject<string> = new BehaviorSubject<string>(' ');
    public sideMenuOpened: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

    constructor(private chatService: ChatService){}

    public calculateUnread(messages: IMessage[]): number {
        let amountOfUnread = 0;
        messages.forEach(message => {
            if (message.read.indexOf(this.chatService.me) === -1 && this.chatService.me !== message.creator?.id)
                amountOfUnread += 1;
        });
        return amountOfUnread;
        // this.unreadMessages.emit({unread: this.amountOfUnread, roomId: this.currentRoom._id});
    }
}
