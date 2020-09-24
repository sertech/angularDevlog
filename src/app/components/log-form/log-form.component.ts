import { Component, OnInit } from '@angular/core';

//* to use the subject behavior we need to import the service where we defined the behavior stuff and the model
//* we do this because the form component need to listen to this change when we click a log
import { LogService } from '../../services/log.service';
import { Log } from '../../models/log';

@Component({
  selector: 'app-log-form',
  templateUrl: './log-form.component.html',
  styleUrls: ['./log-form.component.css'],
})
export class LogFormComponent implements OnInit {
  id: string;
  text: string;
  date: any;

  //* for Add log we need to know if it is a new log or is one we are updating
  isNew: boolean = true;

  //* after importing the service we must inject it in the constructor
  constructor(private logService: LogService) {}

  ngOnInit(): void {
    //* subscribe to the selected log observable inside log.service.ts line 24
    //* so when we click a log in the logs.component.ts its showing in the log-form.component.ts
    this.logService.selectedLog.subscribe((log) => {
      console.log(log);
      //* we want to see if it was actually clicked and its not a new log
      if (log.id !== null) {
        this.isNew = false;
        this.id = log.id;
        this.text = log.text;
        this.date = log.date;
      }
    });
  }

  onSubmit() {
    //* check if new log
    if (this.isNew) {
      // create a new log
      const newLog = {
        //* here is where we have to generate an id (uuid)
        id: this.generateId(),
        text: this.text,
        date: new Date(),
      };
      // use a service function to add the log
      this.logService.addLog(newLog);
    } else {
      //* create a log to be updated
      const updLog = {
        id: this.id,
        text: this.text,
        date: new Date(),
      };
      //* update log
      this.logService.updateLog(updLog);
    }

    // clear the state -- clean the input
    this.clearState();
  }

  clearState() {
    this.isNew = true;
    this.id = '';
    this.text = '';
    this.date = '';
    this.logService.clearState();
  }

  generateId() {
    //! https://stackoverflow.com/questions/105034/how-to-create-guid-uuid
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (
      c
    ) {
      var r = (Math.random() * 16) | 0,
        v = c == 'x' ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  }
}
