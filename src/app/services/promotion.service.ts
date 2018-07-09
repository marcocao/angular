import { Injectable } from '@angular/core';

import { Promotion } from '../shared/promotion';
import { PROMOTIONS } from '../shared/promotions';

import { Observable, of } from 'rxjs';
import { delay, map } from 'rxjs/operators';

import { Restangular } from 'ngx-restangular';

@Injectable({
  providedIn: 'root'
})
export class PromotionService {

  constructor(private restangular: Restangular) { }

  getPromotions(): Observable<Promotion[]> {
    //return new Promise(resolve => {
    //  setTimeout(() => resolve(PROMOTIONS), 2000);
    //});

    //return of(PROMOTIONS).pipe(delay(2000));

    return this.restangular.all('promotions').getList();
  }

  getPromotion(id: number): Observable<Promotion> {
    //return new Promise(resolve => {
     // setTimeout(() => resolve(PROMOTIONS.filter(promotion => promotion.id === id)[0]), 2000);
    //});

    //return of(PROMOTIONS.filter(promotion => promotion.id === id)[0]).pipe(delay(2000));

    return this.restangular.one('promotions', id).get();
  }

  getFeaturedPromotion(): Observable<Promotion> {
    //return new Promise(resolve => {
     // setTimeout(() => {resolve(PROMOTIONS.filter(promotion => promotion.featured)[0])}, 2000);
    //});

    // return of(PROMOTIONS.filter(promotion => promotion.featured)[0]).pipe(delay(2000));

    return this.restangular.all('promotions').getList({featured:true}).pipe(map(promotions => promotions[0]));
  }

}
