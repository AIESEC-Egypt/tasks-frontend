import {Component, Renderer} from "@angular/core";

import {PersonService} from "../../persons/services/person.service";
import {Task} from '../../tasks/task';
import {AuthService} from "../../auth/services/auth.service";
import {TaskTime} from "../task-time";
import {TaskService} from "../services/task.service";
import {TaskDoneComponent} from "./task-done.component";
import {DND_DIRECTIVES} from "ng2-dnd/ng2-dnd";

@Component({
    selector: 'my-tasks',
    styles: [`
        .text-muted {
            font-size: 0.75rem;
        }
        
        .donebox {
            font-size: 1.5em;
            margin-top: 0.3em;
        }
        
        .mark-done {
            opacity: 0.3;
        }
        
        .mark-done:hover {
            opacity: 1;
        }
        
        .fa-mark-done::before {
            content: '\\f10c';
        }
        
        .fa-mark-done:hover::before {
            content:'\\f05d';
        }
        
        .task {
            border: 1px solid #efefef;
            border-radius: 5px;
            margin-top: 1em;
        }
    `],
    template: `
        <task-done *ngIf="doneTask" [task]="doneTask" (done)="proceedDone($event);" (close)="doneTask = false;"></task-done>
        <div class="container">
            <!-- upper form -->
            <div class="row hidden-md-down">
                <div class="col-lg-12" style="background-color: #eee; padding-top: 1em;">
                    <div *ngIf="errorForm" class="alert alert-danger">{{errorForm}}</div>
                    <form class="form-inline row" (ngSubmit)="createTask()" #upperForm="ngForm">
                        <div class="form-group col-lg-5 col-xl-6">
                            <div class="input-group" style="width: 100%">
                                <input type="text" class="form-control" id="taskName" placeholder="New Task *" required [(ngModel)]="newTask.name">
                            </div>
                            <label for="taskName" class="sr-only">New Task *</label>
                        </div>
                        <div class="form-group col-lg-2">
                            <div class="input-group" style="width: 100%;">
                                <div class="input-group-addon"><i class="fa fa-clock-o" aria-hidden="true"></i></div>
                                <input type="time" id="estimatedTime" class="form-control" placeholder="estimated time" style="line-height: 1.5;" required [(ngModel)]="newTask.estimated">
                            </div>
                            <label for="estimatedTime">Estimated time *</label>
                        </div>
                        <div class="form-group col-lg-4 col-xl-3">
                            <div class="input-group" style="width: 100%;">
                                <div class="input-group-addon"><i class="fa fa-calendar-o" aria-hidden="true"></i></div>
                                <input type="datetime-local" id="dueDate" class="form-control" placeholder="dd.mm.yyyy hh:mm" style="line-height: 1.5;" [(ngModel)]="newTask.due">
                            </div>
                            <label for="dueDate">Due date</label>
                        </div>
                        <div class="form-group col-lg-1">
                            <button type="submit" class="btn btn-primary" [disabled]="!upperForm.form.valid" style="width: 100%; padding: .375rem .5rem;">Add</button>
                        </div>
                    </form>
                </div>
            </div>
            <!-- Task List -->
            <div class="row">
                <div *ngIf="errorTask" class="alert alert-danger">{{errorTask}}</div>
                <div *ngIf="tasks == null">Loading tasks ...</div>
                <div *ngIf="tasks" class="col-xs-12 col-lg-6 col-lg-offset-3">
                    <div *ngFor="let task of tasks" class="task row" #taskEl (dragstart)="dragStart($event, task);" (dragover)="dragOver($event, taskEl);" (drop)="drop($event, task);" (touchmove)="touchMove($event, taskEl);" [attr.data-taskId]="task.id">
                        <div *ngIf="!task.done" class="col-xs-1 donebox mark-done" (click)="doneTask = task;">
                            <i class="fa fa-mark-done" aria-hidden="true"></i>
                        </div>
                        <div *ngIf="task.done" class="col-xs-1 donebox">
                            <i class="fa fa-check-circle-o" aria-hidden="true"></i>
                        </div>
                        <div class="col-xs-10">
                            <span>{{task.name}}</span><br />
                            <div class="clearfix">
                                <span *ngIf="!task.done" class="text-muted pull-xs-left">Estimated:&nbsp;{{getTaskTime(task.estimated).toString()}}</span>
                                <span *ngIf="task.done" class="text-muted pull-xs-left">Waiting for approval</span>
                                <span *ngIf="task.due" class="text-muted pull-xs-right {{getDateClasses(task.due)}}">Due:&nbsp;{{getDate(task.due)}}</span>
                            </div>
                        </div>
                        <div class="col-xs-1" style="font-size: 1.5em;" (mousedown)="taskEl.draggable = true;" (mouseup)="taskEl.draggable = false;" (touchstart)="touchStart($event, task, taskEl);" (touchend)="touchEnd($event);">
                           <span>☰</span>
                        </div>
                    </div>
                </div>
            </div>
            <!-- lower Form -->
            <hr class="hidden-lg-up">
            <div class="row hidden-lg-up">
                <div class="col-xs-12" style="background-color: #eee; padding-top: 1em;">
                    <div *ngIf="errorForm" class="alert alert-danger">{{errorForm}}</div>
                    <form class="form" (ngSubmit)="createTask()" #lowerForm="ngForm">
                        <div class="row">
                            <div class="form-group col-xs-12">
                                <label for="taskNameLower">New Task *</label>
                                <input type="text" class="form-control" id="taskNameLower" placeholder="New Task" [(ngModel)]="newTask.name" required>
                            </div>
                        </div>
                        <div class="row">
                            <div class="form-group col-xs-12 col-md-6">
                                <label for="estimatedTimeLower">Estimated time *</label>
                                <div class="input-group" style="width: 100%;">
                                    <div class="input-group-addon"><i class="fa fa-clock-o" aria-hidden="true"></i></div>
                                    <input type="time" id="estimatedTimeLower" class="form-control" placeholder="estimated time" style="line-height: 1.5;" [(ngModel)]="newTask.estimated" required>
                                </div>
                            </div>
                            <div class="form-group col-xs-12 col-md-6">
                                <label for="dueDateLower">Due date</label>
                                <div class="input-group" style="width: 100%;">
                                    <div class="input-group-addon"><i class="fa fa-calendar-o" aria-hidden="true"></i></div>
                                    <input type="datetime-local" id="dueDateLower" class="form-control" placeholder="dd.mm.yyyy hh:mm" style="line-height: 1.5;" [(ngModel)]="newTask.due">
                                </div>
                            </div>
                        </div>
                        <div class="row">
                            <div class="form-group col-xs-12">
                                <button type="submit" class="btn btn-primary" [disabled]="!lowerForm.form.valid">Add</button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
            <br />
        </div>
    `,
    directives: [TaskDoneComponent, DND_DIRECTIVES],
    providers: [PersonService, TaskService]
})
export class MyTasksComponent {

    private tasks : Task[];
    private doneTask : Task;
    private newTask : Task;
    private errorTask : string;
    private errorForm : string;

    // drag and drop
    private currentDndTask : Task;
    private currentDndTarget : HTMLElement;
    private currentTouchTarget : HTMLElement;
    private currentTouchShadow : HTMLElement;
    private offsetX : number;
    private offsetY : number;

    constructor(private _personService : PersonService, private _authService:AuthService, private _taskService:TaskService, private _renderer:Renderer) {
        this.load();
        this.newTask = new Task();
    }

    touchStart(event, task, taskEl) {
        event.preventDefault();
        this.currentDndTask = task;
        this.currentTouchTarget = event.target;
        this.currentTouchShadow = this._renderer.createElement(taskEl, 'div', null);
        this.currentTouchShadow.style.position = "fixed";
        this.currentTouchShadow.style.height = taskEl.clientHeight;
        this.currentTouchShadow.style.width = taskEl.clientWidth;
        this.currentTouchShadow.innerHTML = taskEl.innerHTML;

        this.offsetX = event.targetTouches[0].clientX - taskEl.getBoundingClientRect().left;
        this.offsetY = event.targetTouches[0].clientY - taskEl.getBoundingClientRect().top;

        this.currentTouchShadow.style.left = taskEl.getBoundingClientRect().left;
        this.currentTouchShadow.style.top = taskEl.getBoundingClientRect().top;
    }

    touchMove(event, taskEl) {
        if(this.currentTouchTarget === event.target) {
            event.preventDefault();

            let target : HTMLElement = taskEl.ownerDocument.elementFromPoint(event.targetTouches[0].clientX, event.targetTouches[0].clientY);
            while(target != null && target.className.indexOf('task') == -1) {
                target = target.parentElement;
            }
            this.proceedTarget(target);

            this.currentTouchShadow.style.left = String(event.targetTouches[0].clientX - this.offsetX);
            this.currentTouchShadow.style.top = String(event.targetTouches[0].clientY - this.offsetY);

            return false;
        }
    }

    touchEnd(event) {
        if(this.currentTouchTarget === event.target) {
            this.currentTouchTarget = null;
            this.currentTouchShadow.parentElement.removeChild(this.currentTouchShadow);
            if(this.currentDndTarget != null) {
                this.proceedDrop(this.currentDndTarget.getAttribute('data-taskId'));
            }
        }
    }

    dragStart(e, task) {
        this.currentDndTask = task;
        e.dataTransfer.effectAllowed = 'move';
    }

    dragOver(e, taskEl) {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';

        this.proceedTarget(taskEl);

        return false;
    }

    drop(e, dropTask) {
        if (e.stopPropagation) {
            e.stopPropagation();
        }
        this.proceedDrop(dropTask.id);
    }

    proceedTarget(targetEl) {
        if(targetEl != this.currentDndTarget) {
            if(this.currentDndTarget != null) {
                this.currentDndTarget.style.borderTop = "";
            }
            this.currentDndTarget = targetEl;
            if(targetEl != null) {
                targetEl.style.borderTop = "5px solid brown";
            }
        }
    }

    proceedDrop(targetId) {
        if(this.currentDndTarget != null) {
            this.currentDndTarget.style.borderTop = "";
            this.currentDndTarget = null;
        }
        if(targetId != this.currentDndTask.id && targetId != null) {
            var order = [];
            for(var i in this.tasks) {
                if (this.tasks[i].id == this.currentDndTask.id) {
                    this.tasks.splice(parseInt(i), 1);
                    break;
                }
            }
            for(var i in this.tasks) {
                if(this.tasks[i].id == targetId) {
                    this.tasks.splice(parseInt(i), 0, this.currentDndTask);
                    break;
                }
                order.push(this.tasks[i].id);
            }
            this.currentDndTask = null;
            for(var j:number = order.length; j < this.tasks.length; j++) {
                order.push(this.tasks[j].id);
            }
            this._taskService.prioritize(order).subscribe(res => {
                if(typeof res.status == 'undefined') {
                    this.errorTask = "Unexpected Server Response";
                } else {
                    if(res.status.code != 200) {
                        this.errorTask = res.status.message;
                    } else {
                        this.errorTask = null;
                    }
                }
            }, error => {
                this.errorTask = error;
                this.load();
            });
        }
    }

    getDate(date: string) : string {
        var d:Date = new Date(date);
        return ((d.getDate() < 10) ? '0' + d.getDate() : d.getDate()) + ((d.getMonth() < 9) ? '.0' + (d.getMonth() + 1) : '.' + (d.getMonth() + 1)) + '.' + d.getFullYear();
    }

    getDateClasses(date: string) : string {
        var d:Date = new Date(date);
        var now:Date = new Date();
        if(d.getTime() < now.getTime()) {
            return 'text-danger';
        } else if(d.getTime() < now.getTime() + 86400000) {
            return 'text-warning';
        } else {
            return '';
        }
    }

    getTaskTime(time) {
        return new TaskTime(time);
    }

    proceedDone(done) {
        if(done) {
            for(var i in this.tasks) {
                if(this.tasks[i].id == this.doneTask.id) {
                    this.tasks[i].done = true;
                    this.tasks[i].done_at = new Date();
                }
            }
            this.doneTask = null;
        }
    }
    
    load() {
        this._authService.getCurrentPerson().flatMap(person =>
            this._personService.getTasks(person.id)
        ).subscribe(tasks => this.tasks = tasks, error => {
            this.errorTask = error;
        });
    }

    createTask() {
        this.errorForm = null;

        let task : Task = new Task();
        task.name = this.newTask.name;
        task.estimated = new TaskTime(this.newTask.estimated.toString()).toNumber();
        task.due = this.newTask.due;

        if(task.estimated < 1) {
            this.errorForm = "Error: estimated time has invalid format";
        } else {
            this._authService.getCurrentPerson().flatMap(person =>
                this._taskService.create(person.id, task)
            ).subscribe(tasks => {
                this.tasks = tasks;
                this.newTask = new Task();
            }, error => {
                this.errorForm = error;
            });
        }
    }
}