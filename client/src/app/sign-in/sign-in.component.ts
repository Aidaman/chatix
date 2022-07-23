import {Component, OnInit} from '@angular/core';
import {AuthService} from "../shared/services/auth.service";
import {environment} from "../../environments/environment";
import {ActivatedRoute} from "@angular/router";

@Component({
    selector: 'app-sign-in',
    templateUrl: './sign-in.component.html',
    styleUrls: ['./sign-in.component.scss']
})
export class SignInComponent implements OnInit{
    public url = environment.API_URL;

    constructor(private authService: AuthService,
                private route: ActivatedRoute) {
    }

    ngOnInit(): void {
      this.authService.authenticate(this.route.snapshot.queryParams);
    }
}
