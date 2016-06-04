import {Component, OnInit} from '@angular/core';
import {RouteConfig, ROUTER_DIRECTIVES, ROUTER_PROVIDERS} from "@angular/router-deprecated";
import {HTTP_PROVIDERS} from "@angular/http";
import {CookieService} from 'angular2-cookie/core';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/catch';

import 'rxjs/add/observable/from';
import 'rxjs/add/observable/throw';

import {AuthService} from './auth/services/auth.service';

import {CallbackComponent} from "./auth/components/callback.component";
import {MyTasksComponent} from "./tasks/components/my-tasks.component";

@Component({
    selector: 'tasks-app',
    template: `
        <div class="container">
            <div class="row">
                <nav class="navbar navbar-dark bg-inverse">
                    <a class="navbar-brand">My Tasks</a>
                </nav>
            </div>
        </div>
        <br />
        <router-outlet></router-outlet>
    `,
    directives: [ROUTER_DIRECTIVES],
    providers: [ROUTER_PROVIDERS, AuthService, HTTP_PROVIDERS, CookieService]
})
//noinspection TypeScriptValidateTypes
@RouteConfig([
    {path: '/',     name: 'MyTasks',    component: MyTasksComponent},
    {path: '/signin',   name: 'OAuth2Callback',     component: CallbackComponent}
])
export class TasksAppComponent {}