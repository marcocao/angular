import { Injectable } from '@angular/core';
import { Dish } from '../shared/dish';
import { Http, Response } from '@angular/http'

import { Observable, of } from 'rxjs';
import { delay, map, catchError } from 'rxjs/operators';

import { baseURL } from '../shared/baseurl';
import { ProcessHttpMsgService } from './process-http-msg.service'

import { Restangular } from 'ngx-restangular';

@Injectable({
  providedIn: 'root'
})
export class DishService {

  constructor(private restangular: Restangular, protected processHttpMsg: ProcessHttpMsgService) { }

  getDishes(): Observable<Dish[]> {
    return this.restangular.all('dishes').getList();
    //return this.http.get(baseURL+'dishes').pipe(map(res => {return this.processHttpMsg.extractData(res);}),
    //catchError(err => {return this.processHttpMsg.hanlderError(err); }));
  }

  getDish(id: number): Observable<Dish> {
   // return new Promise( resolve => {
   //   setTimeout(() => resolve(DISHES.filter(dish => dish.id === id)[0]), 2000)
   // });
   //return of(DISHES.filter(dish => dish.id === id)[0]).pipe(delay(2000));

   //return this.http.get(baseURL+'dishes/' + id).pipe(map(res => {return this.processHttpMsg.extractData(res);}),
   //catchError(err => {return this.processHttpMsg.hanlderError(err); }));

   return this.restangular.one('dishes', id).get();
  }

  getFeaturedDish(): Observable<Dish> {
    //return new Promise(resolve => {
    //  setTimeout(() => resolve(DISHES.filter(dish => dish.featured)[0]), 2000);
    //});

    //return of(DISHES.filter(dish => dish.featured)[0]).pipe(delay(2000));
    //return this.http.get(baseURL+'dishes?featured=true').pipe(map(res => {return this.processHttpMsg.extractData(res)[0];}),
    //catchError(err => {return this.processHttpMsg.hanlderError(err); }));

    return this.restangular.all('dishes').getList({featured:true}).pipe(map(dishes => dishes[0]));
  }

  getDishIds(): Observable<number[]>{
    //return of(DISHES.map(dish => dish.id)).pipe(delay(2000));
    return this.getDishes().pipe(map(dishes => {return dishes.map(dish => dish.id);}));
  }
}
