import { Component, Input, OnInit } from '@angular/core';
import * as echarts from 'echarts/types/dist/echarts';
import { EChartsOption, SeriesOption } from 'echarts/types/dist/echarts';
@Component({
  selector: 'stat-event-chart',
  templateUrl: './stat-event-chart.component.html',
})
export class StatEventChartComponent implements OnInit {
  JSON = JSON;
  @Input() EventName:string = '';
  @Input() MatchesWithPlayersCount: Map<string, Map<string, number>> = new Map<string, Map<string, number>>();
  option: EChartsOption;
  visible: boolean = true;
  xAxis: string[] = [];
  
  constructor() { }

  instance: echarts.ECharts;
  ngOnInit() {
    this.updateSeries();
  }

  onChartInit(ec: echarts.ECharts) {
    this.instance = ec;
  }
  
  resizeChart() {
    if (this.instance) {
      this.instance.resize();
    }
  }

  getSeries(): SeriesOption[] {

    let seriesOption: SeriesOption[] = [];  
    let series: Map<string, number[]> = new Map<string, number[]>();

    for(let [year , playerCount] of this.MatchesWithPlayersCount){
      for(let [player, count] of playerCount ){
        if(!series.has(player)){
          series.set(player, []);
        }
        series.get(player).push(count);
      }
    }


    for(let [player, counts] of series){
      seriesOption.push({
            name: player,
            type: 'line',
            data: counts,
            emphasis: {
              focus: 'series'
            }
      })
    }

    return seriesOption;

  }

  
  updateSeries(){
   

    let series = this.getSeries();

    this.option = {
      title: {
        text: this.EventName,
        left: 'left', //center or right
      },
      tooltip: {
        trigger: 'item',
        formatter: '{a} <br/>{b} : {c}'
      },
      legend: {
        left: 'right',
        top: 30

      },
      toolbox: {
        show: true,
        orient: 'vertical',
        left: 'right',
        top: 'center',
        feature: {
          mark: { show: false },
          dataView: { show: true, readOnly: true },
          magicType: { show: true, 
            type: ['line', 'bar'],
            // option: { 
            //   line:{        
            //     type: 'value',
            //   }, 
            //   bar: {                
            //     type: 'value',
            //   }  
            // }
           },
          restore: { show: false },
          saveAsImage: { show: true }
        }
      },
      grid: {
        // left: '3%',
        // right: '4%',
        // bottom: '3%',
        containLabel: true,
        // borderWidth: 1,
        // show:true,
        // borderColor: '#ccc'
      },
      xAxis: {
        type: 'category',
        name: 'Match',
        splitLine: { show: false },
        data: [...this.MatchesWithPlayersCount.keys()],
        axisLabel: {
          interval: 0,
          rotate: 90 //If the label names are too long you can manage this by rotating the label.
        }, alignTicks: true
      },
      yAxis: {
        type: 'value',
        min: 0,
        minInterval: 1,
        //name: 'y',
        minorSplitLine: {
          show: false
        }
      },
      series: series
    };
  }
}
