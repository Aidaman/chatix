import {Injectable} from "@angular/core";
import {BehaviorSubject, Observable, Subject, tap} from "rxjs";
import {IRoom} from "../models/IRoom";
import {SocketService} from "./socket.service";
import {IMessage} from "../models/IMessage";
import {LocalStorageService} from "./local-storage.service";

@Injectable({
    providedIn: 'root',
})
export class RoomService{
    private me: string = this.localStorageService.getUser()['id'] as string;

    public message: BehaviorSubject<string> = new BehaviorSubject<string>(' ');
    public sideMenuOpened: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    public currentRoom: BehaviorSubject<IRoom> = new BehaviorSubject<IRoom>({
      _id: "",
      creator: null,
      index: 0,
      isFavorites: false,
      isPublic: false,
      lastAction: new Date(),
      title: "",
      users: []
    });
    // public messages: Observable<Message[]> = this.socketService.listen('messageRead');

    constructor(private socketService: SocketService,
                private localStorageService: LocalStorageService){}

    public calculateUnread(messages: IMessage[]): number {
        let amountOfUnread = 0;
        messages.forEach(message => {
            if (message.read.indexOf(this.me) === -1 && this.me !== message.creator?.id)
                amountOfUnread += 1;
        });
        return amountOfUnread;
        // this.unreadMessages.emit({unread: this.amountOfUnread, roomId: this.currentRoom._id});
    }
}
