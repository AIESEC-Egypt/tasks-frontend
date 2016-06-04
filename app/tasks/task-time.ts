export class TaskTime {
    hours: number;
    minutes: number;

    constructor(str : string) {
        if(typeof str == 'string' && str.indexOf(':') > 0) {
            this.hours = parseInt( str.substr(0, str.indexOf(':')) );
            this.minutes = parseInt( str.substr(str.indexOf(':') + 1, str.length) );
        } else {
            let minutes:number = parseInt(str);
            if(!isNaN(minutes)) {
                this.hours = Math.floor(minutes / 60);
                this.minutes = minutes % 60;
            }
        }
    }

    toString():string {
        return ((this.hours < 10) ? '0' + this.hours : this.hours) + ':' + ((this.minutes < 10) ? '0' + this.minutes : this.minutes);
    }

    toNumber():number {
        return this.hours * 60 + this.minutes;
    }
}