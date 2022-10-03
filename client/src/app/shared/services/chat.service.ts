import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { BehaviorSubject, EMPTY, map, Observable, tap } from "rxjs";
import { IMessage } from "../models/IMessage";
import { environment } from "../../../environments/environment";
import { LocalStorageService } from "./local-storage.service";
import { Store } from "@ngrx/store";
import { IRoom } from "../models/IRoom";
import { allRoomsSelector } from "../../store/chat/chat.selectors";
import { IUser } from "../models/IUser";

@Injectable({
  providedIn: "root"
})
export class ChatService {
  private me: string = this.localStorageService.getUser()["id"] as string;
  public showContextMenu: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public isMyMessage: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public sideMenuOpened: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public showEmoji: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  public lastMessageCreatorId: string = "";

  public overallUnread = this.store.select(allRoomsSelector).pipe(
    map((rooms) => {
      if (rooms) {
        return rooms.reduce((accumulator: number, room: IRoom) => room._id !== "common" ? accumulator + room.unread : accumulator, 0);
      } else return 0;
    }),
  );

  constructor(private http: HttpClient,
              private store: Store,
              private localStorageService: LocalStorageService) {}

  public getMe(): string{
    if (!this.me) {
      this.me = this.localStorageService.getUser()["id"] as string;
    }
    return this.me;
  }
  /*
  * @description A function for get the messages for the room
  * @param id: id of the room that requesting the messages
  * @param offset: offset to take messages
  * @param limit: describes how many messages backend should send us
  */
  public getRoomContent(id: string, offset?: number, limit?: number): Observable<IMessage[]> {
    if (id === "common") return EMPTY;
    return this.http.get<IMessage[]>(`${environment.DOTNET_API_URL}/api/messages/RoomContent/${id}/${offset}/${limit}`);
  }

  /*
  * @description A function for get the number of messages in the room
  * @param id: id of the room that requesting this
  */
  public getRoomMessagesAmount(id: string): Observable<string> {
    return this.http.get<string>(`${environment.DOTNET_API_URL}/api/messages/RoomAmountOfMessage/${id}`);
  }

  /*
  * @description A function for get the rooms available for this user
  */
  public getAvailableRooms(isPublic?: boolean): Observable<IRoom[]> {
    if (isPublic !== undefined)
      return this.http.get<IRoom[]>(`${environment.DOTNET_API_URL}/api/rooms/availableFor/${this.me}/${isPublic}`);
    else
      return this.http.get<IRoom[]>(`${environment.DOTNET_API_URL}/api/rooms/availableFor/${this.me}`);
  }

  public getUsersByName(name: string): Observable<IUser[]> {
    return this.http.get<IUser[]>(`${environment.DOTNET_API_URL}/api/users/search/${name}`);
  }

  public getRoomByTitle(title: string): Observable<IRoom[]> {
    return this.http.get<IRoom[]>(`${environment.DOTNET_API_URL}/api/rooms/search/${title}`);
  }

  public getBlacklist(): Observable<string[]> {
    return this.http.get<string[]>(`${environment.DOTNET_API_URL}/blacklist`);
  }

  public addToBlacklist(id: string): Observable<string[]> {
    return this.http.post<string[]>(`${environment.DOTNET_API_URL}/blacklist`, { blacklistedId: id });
  }

  public deleteFromBlacklist(id: string): Observable<any> {
    return this.http.request("delete", `${environment.DOTNET_API_URL}/blacklist`, {
      body: {
        blacklistedId: id,
      }
    });
  }

  /*
  * @description A function for calculate how many messages is unread in current room
  * @param messages: an array of messages that being proceeded
  */
  public calculateUnread(messages: IMessage[]): number {
    let amountOfUnread = 0;
    messages.forEach(message => {
      if (!message.isSystemMessage && this.me !== message.creator?._id && message.read.indexOf(this.me) === -1)
        amountOfUnread += 1;
    });
    return amountOfUnread;
  }
}
