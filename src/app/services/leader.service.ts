import { Injectable } from '@angular/core';

import { Leader } from '../shared/leader';
import { LEADERS } from '../shared/leaders';

import { Observable, of } from 'rxjs';
import { delay, map } from 'rxjs/operators';

import { Restangular } from 'ngx-restangular';

@Injectable({
  providedIn: 'root'
})
export class LeaderService {

  constructor(private restangular: Restangular) { }

  getLeaders(): Observable<Leader[]> {
    //return new Promise( resolve => {
    //  setTimeout(() => resolve(LEADERS), 2000);
    //});

    //return of(LEADERS).pipe(delay(2000));

    return this.restangular.all('leaders').getList();
  }

  getLeader(id: number): Observable<Leader> {
    //return new Promise( resolve => {
    //  setTimeout(() => resolve(LEADERS.filter(Leader => Leader.id === id)[0]), 2000);
    //});

    //return of(LEADERS.filter(Leader => Leader.id === id)[0]).pipe(delay(2000));

    return this.restangular.one('leaders').get();
  }

  getFeaturedLeader(): Observable<Leader> {
    //return new Promise( resolve => {
    //  setTimeout(() => resolve(LEADERS.filter(Leader => Leader.featured)[0]), 2000);
    //});

    //return of(LEADERS.filter(Leader => Leader.featured)[0]).pipe(delay(2000));

    return this.restangular.all('leaders').getList({featured:true}).pipe(map(leaders => leaders[0]));
  }
}
