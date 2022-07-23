import { Injectable } from '@angular/core';
import {
  Router, Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot
} from '@angular/router';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RoomResolver implements Resolve<boolean> {
  /*
  * this.store select room-chat by id
  * тут же диспатчить запрос на мэссэджи, по айди комнаты
  *
  * */

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {

    return of(true);
  }
}
