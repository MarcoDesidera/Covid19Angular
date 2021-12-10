import { Component, Input, OnInit } from '@angular/core';
import { Chart } from 'angular-highcharts';
import { color } from 'highcharts';

@Component({
  selector: 'app-chart',
  //templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.css'],
  template: `
    <div [chart]="chart" id="chart"></div>
    <div [chart]="deathCount" id="deathChart"></div>
  `
})
export class ChartComponent implements OnInit {

  @Input() json: any
  data: any
  death: any
  xAxisLabel: any
  chart: Chart;
  deathCount: Chart;
  n: number;

  constructor() {
    this.chart = new Chart();
    this.deathCount = new Chart();
    this.n = 1;
    this.data = [];
    this.death = [];
    this.xAxisLabel = [];
   }

  ngOnInit(): void {
    this.addData(this.json);
    this.init();
  }

  addData(array:any)
  {
    for(let i = 0;i<array.length;i++)
    {
      for(let key in array[i])
      {
        if(key == 'totale_casi')
        {
          this.data.push(array[i][key]);
          this.xAxisLabel.push(array[i].data.split("T")[0]);
        }else if(key == 'deceduti')
        {
          this.death.push(array[i][key]);
        }
      }
    }
  }

  selectItem(array: any)
  {
    console.log(array);
    let interval = 3;
    for(let i = 0;i<array.length;i++)
    {
      if(i == interval)
      {
        array.splice(i, 100);
        interval += interval;
      }
    }

    console.log(array);
  }

  totalCasesChart()
  {
    console.log(this.xAxisLabel);
    let chart = new Chart({
      chart: {
        type: 'line',
        borderColor: 'white',
        borderRadius: 10,
        style: {fontFamily: 'monospace', color: 'white'}
      },
      title: {
        text: 'Totale dei casi'
      },
      credits: {
        enabled: false
      },
      xAxis: {
        type: 'datetime',
        categories: this.xAxisLabel,
        labels: {
          allowOverlap: false,
          step: 0
        }
      },
      series: [
        {
          name: 'Line 1',
          type: 'line',
          data: this.data
        }
      ],
      colors: ['green']
    })

    this.chart = chart;
  }

  deathChart()
  {
    console.log(this.xAxisLabel);
    let chart = new Chart({
      chart: {
        type: 'line',
        borderColor: 'white',
        borderRadius: 10,
        style: {fontFamily: 'monospace', color: 'white'}
      },
      title: {
        text: 'Morti'
      },
      credits: {
        enabled: false
      },
      xAxis: {
        type: 'datetime',
        categories: this.xAxisLabel,
        labels: {
          allowOverlap: false,
          step: 0
        }
      },
      series: [
        {
          name: 'Line 1',
          type: 'line',
          data: this.death
        }
      ],
      colors: ['red']
    })

    this.deathCount = chart;
  }

  init()
  {
    this.totalCasesChart();
    this.deathChart();
  }

}
