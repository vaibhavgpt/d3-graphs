import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  public id: Array<string> = ['line', 'bar', 'dot', 'multi'];
  title = 'ngx-d3-graph-demo';
}
