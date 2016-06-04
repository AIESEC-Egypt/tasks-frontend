import {config} from '../../config'
import {Injectable} from "@angular/core";

import {Http, Response, Headers, RequestOptions} from '@angular/http';
import {Observable}     from 'rxjs/Observable';

import {AuthService} from '../../auth/services/auth.service';

import {Task} from '../task';


@Injectable()
export class TaskService {
    constructor(private _authService: AuthService, private _http:Http) {}

    create(pid:number, task:Task) : Observable<Task[]> {
        let body = JSON.stringify(task);
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });

        return this._authService.getToken().flatMap(token =>
            this._http.post(config.API_BASE + 'v1/persons/' + pid + '/tasks.json?access_token=' + token, body, options)
                .map(res => <Task[]>res.json().tasks)
                .catch(this.handleError)
        );
    }

    done(tid:number, needed:number = null) : Observable<Task> {
        let body = JSON.stringify({needed: needed});
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });

        return this._authService.getToken().flatMap(token =>
            this._http.post(config.API_BASE + 'v1/tasks/' + tid + '/done.json?access_token=' + token, body, options)
                .map(res => <Task>res.json().task)
                .catch(this.handleError)
        );
    }

    prioritize(order : number[]) : Observable<any> {
        let body = JSON.stringify({ids: order});
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });

        return this._authService.getToken().flatMap(token =>
            this._http.post(config.API_BASE + 'v1/tasks/prioritize.json?access_token=' + token, body, options)
                .map(res => res.json())
                .catch(this.handleError)
        );
    }

    private handleError (error: Response) {
        console.error(error);
        var e:string = 'Server error';
        if(typeof error.json().status != 'undefined' && typeof error.json().status.message != 'undefined') e = error.json().status.message;
        return Observable.throw(e);
    }
}