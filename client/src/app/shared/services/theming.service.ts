import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { LocalStorageService } from "./local-storage.service";

@Injectable({
  providedIn: "root"
})
export class ThemingService {
  public theme: BehaviorSubject<string> = new BehaviorSubject<string>("dark");

  constructor(private localStorageService: LocalStorageService) {
    this.theme.next(this.localStorageService.getUser()["colorTheme"]);
  }

  public saveTheme(theme: string): void {
    const user = this.localStorageService.getUser();
    user["colorTheme"] = theme;
    this.localStorageService.setUser(JSON.stringify(user));
  }
}
