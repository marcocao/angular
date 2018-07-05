import { Injectable } from '@angular/core';

import { Observable, of } from 'rxjs';
import { Http, Response } from '@angular/http'

@Injectable({
  providedIn: 'root'
})
export class ProcessHttpMsgService {

  constructor() { }

  public extractData(res: Response){
     let body = res.json();

     return body || {};
  }

  public hanlderError(error: Response | any){
    let errMsg: string;

    if(error instanceof Response)
    {
      const body = error.json() || '';
      const err = body.error || JSON.stringify(body);
      errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
    }else
    {
      errMsg = error.message? error.message: error.toString();
    }

    return Observable.throw(errMsg);
  }
}
