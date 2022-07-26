import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {BehaviorSubject, Observable, Subject} from "rxjs";
import {IMessage} from "../models/IMessage";
import {IOption} from "../models/IOption";
import {environment} from "../../../environments/environment";
import {IRoom} from "../models/IRoom";

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  public currentRoomUsers: BehaviorSubject<object[]> = new BehaviorSubject<object[]>([]);
  public showContextMenu: BehaviorSubject<{ event: MouseEvent; options: IOption[] }> = new BehaviorSubject<any>(null);
  public emitOption: BehaviorSubject<string> = new BehaviorSubject<string>('');

  public message: BehaviorSubject<string> = new BehaviorSubject<string>('');
  public lastSelectedMessageId: BehaviorSubject<string> = new BehaviorSubject<string>('');

  public rooms: BehaviorSubject<IRoom[]> = new BehaviorSubject<IRoom[]>([]);
  public currentRoomId: BehaviorSubject<string> = new BehaviorSubject<string>('common');

  constructor(private http: HttpClient) {
  }

  public getRoomContent(id: string, offset?: number, limit?: number): Observable<IMessage[]> {
    return this.http.get<IMessage[]>(`${environment.API_URL}/roomContent/${id}?offset=${offset}&limit=${limit}`);
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
}
