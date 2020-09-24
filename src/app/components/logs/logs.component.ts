import { Component, OnInit } from '@angular/core';
import { Log } from '../../models/log';
import { LogService } from '../../services/log.service';

@Component({
  selector: 'app-logs',
  templateUrl: './logs.component.html',
  styleUrls: ['./logs.component.css'],
})
export class LogsComponent implements OnInit {
  logs: Log[];
  //* the [] at the means that it will also be an array
  selectedLog: Log;
  loaded: boolean = false;

  constructor(private logService: LogService) {}
  
  ngOnInit(): void {
    this.logService.stateClear.subscribe(clear => {
      if(clear) {
        this.selectedLog = {id: '', text: '', date: ''};
      }
    })

    //* get the logs asynchronously
    this.logService.getLogs().subscribe((logs) => {
      this.logs = logs;
      this.loaded = true;
    });
  }

  onSelect(log: Log) {
    console.log(log);
    this.logService.setFormLog(log);
    this.selectedLog = log;
  }

  onDelete(log: Log) {
    console.log(log);
    if(confirm('Are you sure')) {
      this.logService.deleteLog(log);
    }
  }
}
