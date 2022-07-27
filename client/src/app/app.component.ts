import {Component} from '@angular/core';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html'
})
export class AppComponent {}

/*
    @showContextMenu TODO: refactor context menu
                     TODO: Maybe showContextMenu should be BehaviorSubject<boolean>,
                        and options available in the context menu should be determined by object that clicked?
    @device TODO: MAKE ADAPTIVE TEMPLATE
    @Sockets TODO: FIND API FOR SOCKETS
 */
