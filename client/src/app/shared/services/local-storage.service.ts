import {Injectable} from '@angular/core';
import {IUser} from "../models/IUser";

@Injectable({
    providedIn: 'root'
})
export class LocalStorageService {

    constructor() {}

    public setUser(user: string): void {
        localStorage.setItem('user', user);
    }

    public getUser(): IUser {
        return JSON.parse(localStorage.getItem('user') as string) as IUser;
    }

    public getToken(): string {
        const user = JSON.parse(localStorage.getItem('user') as string);
        return user ? JSON.parse(localStorage.getItem('user') as string)['token'] : false;
    }

    public getBlacklist(): string[] {
        return JSON.parse(localStorage.getItem('user') as string)['blacklist'] || [];
    }

    public setBlacklist(blacklistIds: string[]): void {
        localStorage.setItem('blacklist', JSON.stringify(blacklistIds));
    }

    public logout(): void {
        localStorage.removeItem('user');
    }

    // public setScrollPosition(roomId, scrollPos): void {
    //     localStorage.setItem(roomId, scrollPos);
    // }
    //
    // public getScrollPosition(roomId): string {
    //     return localStorage.getItem(roomId);
    // }

    public setlastRoomId(id: any): void {
        localStorage.setItem('lastRoomId', id)
    }

    public getlastRoomId(): string {
        return localStorage.getItem('lastRoomId') as string;
    }

}
