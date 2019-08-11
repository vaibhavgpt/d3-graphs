import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
@Injectable()
export class D3GraphsService {

  constructor(private http: HttpClient) { }

    getD3Graph(graphType) {
    console.log(graphType);console.log('./assets/' + graphType + '.json');
    return this.http.get('./assets/' + graphType + '.json');
  }
}