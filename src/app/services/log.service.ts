import { Injectable } from '@angular/core';

//* behavior subject represents a value that changes over time
//* Observers can subscribe to the subject to receive the last(or initial) value and all subsequent notifications
import { Observable, BehaviorSubject, of } from 'rxjs';

import { Log } from '../models/log';

@Injectable({
  providedIn: 'root',
})
export class LogService {
  logs: Log[];

  //* for behavior subject we need the following
  //? 1) define logSource with an initial value
  private logSource = new BehaviorSubject<Log>({
    id: null,
    text: null,
    date: null,
  });
  //? 2) when we click in one elements we want it to be the selected log and its gonna be an observable
  //? inside log-form.component.ts we subscribe to it
  selectedLog = this.logSource.asObservable();

  //* a new behavior subject ---- because its something we have to monitor
  private stateSource = new BehaviorSubject<boolean>(true); //? 1) true is its default value
  stateClear = this.stateSource.asObservable(); //? 2)

  constructor() {
    // this.logs = [
    //   {
    //     id: '1',
    //     text: 'Generated Components',
    //     date: new Date('12/26/2020 12:54:12'),
    //   },
    //   {
    //     id: '2',
    //     text: 'Added Bootstrap for init',
    //     date: new Date('12/2/2020 9:35:12'),
    //   },
    //   {
    //     id: '3',
    //     text: 'Added logs component',
    //     date: new Date('12/27/2020 12:00:12'),
    //   },
    // ];
    this.logs = [];
  }

  // getLogs(){ //* lets return an observable
  //   return this.logs;
  // } //* making a method observable makes the whole process asynchronous
  getLogs(): Observable<Log[]> {
    if (localStorage.getItem('logs') === null) {
      this.logs = [];
    } else {
      this.logs = JSON.parse(localStorage.getItem('logs'));
    }
    //* sort the logs by date
    return of(
      this.logs.sort((a, b) => {
        console.log(typeof (<any>new Date(b.date) - <any>new Date(a.date)));
        return <any>new Date(b.date) - <any>new Date(a.date);
      })
    );
  }

  //* behavior subject
  setFormLog(log: Log) {
    //* each time we click a new log will be subscribed to it within this form and update the text inside the input
    this.logSource.next(log);
  }

  addLog(log: Log) {
    this.logs.unshift(log);
    //* add local storage
    localStorage.setItem('logs', JSON.stringify(this.logs));
  }

  updateLog(log: Log) {
    this.logs.forEach((cur, index) => {
      if (log.id === cur.id) {
        //* with splice takeout one element, from the index remove one from that index
        this.logs.splice(index, 1);
      }
    });
    this.logs.unshift(log);
    //* update local storage
    localStorage.setItem('logs', JSON.stringify(this.logs));
  }

  deleteLog(log: Log) {
    this.logs.forEach((cur, index) => {
      if (log.id === cur.id) {
        //* with splice takeout one element, from the index remove one from that index
        this.logs.splice(index, 1);
      }
    });

    //* delete from local storage
    localStorage.setItem('logs', JSON.stringify(this.logs));
  }

  clearState() {
    //* what we want to pass to the other component --- second behavior subject
    this.stateSource.next(true);
  }
}

/*
of(...items)—Returns an Observable instance that synchronously delivers the values provided as arguments.

from(iterable)—Converts its argument to an Observable instance. This method is commonly used to convert an array to an observable.
*/
