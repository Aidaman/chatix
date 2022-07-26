import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {IMessage} from "../../../shared/models/IMessage";
import {LocalStorageService} from "../../../shared/services/local-storage.service";
import {ChatService} from "../../../shared/services/chat.service";
import {ThemingService} from "../../../shared/services/theming.service";
import {BehaviorSubject} from "rxjs";

@Component({
    selector: 'app-message-item',
    templateUrl: './message-item.component.html',
    styleUrls: ['./message-item.component.scss']
})
// export class MessageItemComponent implements OnInit {
export class MessageItemComponent implements OnInit {
    @Input() message!: IMessage;
    @Output() loadRequest: EventEmitter<any> = new EventEmitter<any>();
    @Output() viewChange: EventEmitter<object> = new EventEmitter<object>();
    public me: string = this.localStorageService.getUser()['id'] as string;
    public theme: BehaviorSubject<string> = this.themeService.theme;

    constructor(private chatService: ChatService,
                private themeService: ThemingService,
                private localStorageService: LocalStorageService) {
    }

    ngOnInit(): void {
    }

    public messageRequest(scroll?: boolean): void {
        this.loadRequest.emit(scroll);
    }

    public viewportChange(e: any): void {
        if (this.message.read.indexOf(this.me) === -1 && this.me !== this.message.creator?.id) {
            this.viewChange.emit({inView: e, id: this.message._id,});
        }
    }
}
