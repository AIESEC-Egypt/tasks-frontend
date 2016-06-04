import {config} from '../../config'
import {Injectable} from "@angular/core";

import {Http, Response, Headers, RequestOptions} from '@angular/http';
import {Observable}     from 'rxjs/Observable';

import {AuthService} from '../../auth/services/auth.service';

import {Task} from '../../tasks/task';


@Injectable()
export class PersonService {
    constructor(private _authService: AuthService, private _http: Http) {}

    getTasks(id:number): Observable<Task[]> {
        return this._authService.getToken().flatMap(token =>
            this._http.get(config.API_BASE + 'v1/persons/' + id + '/tasks.json?access_token=' + token)
                .map(res => <Task[]>res.json().tasks)
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