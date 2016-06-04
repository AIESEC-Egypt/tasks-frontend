import { bootstrap} from '@angular/platform-browser-dynamic';
import { TasksAppComponent } from './tasks-app.component';
import {DND_PROVIDERS} from 'ng2-dnd/ng2-dnd';
import {enableProdMode} from "@angular/core";

enableProdMode();

bootstrap(TasksAppComponent, [DND_PROVIDERS]);

