import {Person} from "../persons/person";
import {TaskTime} from "./task-time";

export class Task {
    id:number;
    name:string;
    priority:number;
    added_by:Person;
    estimated:number;
    needed:number;
    due:Date;
    done:boolean;
    done_at:Date;
    approved:boolean;
    approved_by:Person;
    approved_at:Date;
    created_at:Date;
    updated_at:Date;


    getNeeded() : TaskTime {
        return new TaskTime(this.needed.toString());
    }

    setNeeded(t:TaskTime) {
        this.needed = t.toNumber();
    }

    getEstimated() : TaskTime {
        return new TaskTime(this.estimated.toString());
    }

    setEstimated(t:TaskTime) {
        this.estimated = t.toNumber();
    }
}