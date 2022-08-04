import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {BehaviorSubject, EMPTY, Observable} from "rxjs";
import {IMessage} from "../models/IMessage";
import {environment} from "../../../environments/environment";
import {IRoom} from "../models/IRoom";
import {LocalStorageService} from "./local-storage.service";

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  public me: string = this.localStorageService.getUser()['id'] as string;

  public showContextMenu: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public contextMenuCoords: BehaviorSubject<{ top: number, left: number }> = new BehaviorSubject<{ top: number, left: number }>({top: 0, left: 0});

  public rooms: BehaviorSubject<IRoom[]> = new BehaviorSubject<IRoom[]>([]);

  public unreadInRooms: any;
  public overallUnreadMessages: number = 0;

  public contactListCoord: BehaviorSubject<{ isOpen: boolean, xPos: number, yPos: number }>
    = new BehaviorSubject<{ isOpen: boolean, xPos: number, yPos: number }>({ isOpen: false, xPos: 0, yPos: 0 });

  constructor(private http: HttpClient,
              private localStorageService: LocalStorageService) {
  }

  public getRoomContent(id: string, offset?: number, limit?: number): Observable<IMessage[]> {
    if (id === "common") return EMPTY;
    return this.http.get<IMessage[]>(`${environment.API_URL}/roomContent/${id}?offset=${offset}&limit=${limit}`);
  }

  public getRoomMessagesamount(id: string): Observable<string> {
    return this.http.get<string>(`${environment.API_URL}/roomAmountOfMessage/${id}`);
  }

  public getBlacklist(): Observable<string[]> {
    return this.http.get<string[]>(`${environment.API_URL}/blacklist`);
  }

  public addToBlacklist(id: string): Observable<string[]> {
    return this.http.post<string[]>(`${environment.API_URL}/blacklist`, {blacklistedId: id});
  }

  public deleteFromBlacklist(id: string): Observable<any> {
    return this.http.request('delete', `${environment.API_URL}/blacklist`, {
      body: {
        blacklistedId: id,
      }
    });
  }

  public recountUnread(): void {
    this.overallUnreadMessages = 0;
    Object.values(this.unreadInRooms).forEach((item: any) => {
      this.overallUnreadMessages += item;
    });
  }

  public calculateUnread(messages: IMessage[]): number {
    let amountOfUnread = 0;
    messages.forEach(message => {
      if (!message.isSystemMessage && this.me !== message.creator?._id && message.read.indexOf(this.me) === -1)
        amountOfUnread += 1;
    });
    return amountOfUnread;
  }
}
