import {Component, Input, OnInit} from '@angular/core';
import * as d3 from 'd3';
import 'd3-selection-multi';
import {Subscription} from 'rxjs';
import {D3GraphsService} from '../../services/d3-graphs.service';
import {GraphModule} from '../../models/graph.module';
import {DisplayMessageModule} from '../../models/display-message.module';

@Component({
  selector: 'app-d3-graphs',
  templateUrl: './d3-graphs.component.html',
  styleUrls: ['./d3-graphs.component.css']
})
export class D3GraphsComponent implements OnInit {
  @Input() graphType: string;
  private subscription: Subscription;
  public data: any;
  public graphSelector: string;
  public removeSvg: string;
  public getGarph: GraphModule = new GraphModule();
  public getMessage: DisplayMessageModule = new DisplayMessageModule();

  constructor(private d3GraphService: D3GraphsService) {
    console.log('Inside D3 Graph Component');
  }

  ngOnInit() {
    this.removeSvg = '#' + this.graphType + ' > *';
    this.graphSelector = '#' + this.graphType;
    console.log('helloDeeksha graph type is', this.graphType, this.removeSvg);
    this.subscription = this.d3GraphService.getD3Graph(this.graphType).subscribe((result) => {
        this.data = result;
        if (this.data != null) {
          this.data = result;
          setTimeout(() => {
            d3.selectAll('#d3-graphs > *').remove();
            this.getGarph.createGraph(this.data, this.graphSelector);
            this.getMessage.displayMessage('Graphs', this.graphSelector);


          }, 1);
        } else {
          this.data.length = 1;
          d3.selectAll('#d3-graphs > *').remove();
          setTimeout(() => {
            this.getMessage.displayMessage('Graphs', this.graphSelector);
          }, 10);
        }
      },
      (error) => {
        d3.selectAll('this.graphSelector > *').remove();
        console.log(error);
      });
  }
}
