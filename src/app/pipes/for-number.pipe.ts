/**
 * Created by dragos on 16/12/2016.
 * I use this to be able to simulate a for i=0; i<x; i++ with *ngFor in lobby.component.html
 */

import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: 'forNumber'})
export class ForNumberPipe implements PipeTransform {
  transform(value: number, args: string[]): any {
    let res: any = [];
    for (let i = 0; i < value; i++) {
      res.push(i);
    }
    return res;
  }
}
