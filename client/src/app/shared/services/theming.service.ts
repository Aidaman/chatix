import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { LocalStorageService } from "./local-storage.service";

/*
*
* //TODO: UPDATE THEMING SERVICE
*
*/

@Injectable({
  providedIn: "root"
})
export class ThemingService {
    public theme: BehaviorSubject<string> = new BehaviorSubject<string>("dark");

    constructor(private localStorageService: LocalStorageService){}

    public saveTheme(theme: string): void {
        const user = this.localStorageService.getUser();
        user["colorTheme"] = theme;
        this.localStorageService.setUser(JSON.stringify(user));
    }
}
