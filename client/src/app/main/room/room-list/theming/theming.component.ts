import {Component, Inject, OnInit, Renderer2} from '@angular/core';
import {ThemingService} from "../../../../shared/services/theming.service";
import {SocketService} from "../../../../shared/services/socket.service";
import {DOCUMENT} from "@angular/common";
import {BehaviorSubject} from "rxjs";

@Component({
  selector: 'app-theming',
  templateUrl: './theming.component.html',
  styleUrls: ['./theming.component.scss']
})
export class ThemingComponent{
    public theme: BehaviorSubject<string> = this.themingService.theme;

    constructor(private themingService: ThemingService,
                private renderer: Renderer2,
                @Inject(DOCUMENT) private document: Document) {
    }

    public toggleTheme(): void {
        this.theme.next(this.theme.value === 'dark'? 'light' : 'dark');
        console.log(this.theme);
        // this.socketService.emit('changeColor', {theme: this.theme.value})

        this.renderer.setAttribute(this.document.body, 'class', this.theme.value)
        this.themingService.saveTheme(this.theme.value);
    }
}
