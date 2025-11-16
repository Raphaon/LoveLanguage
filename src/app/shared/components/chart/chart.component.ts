import { Component, Input, OnInit } from '@angular/core';
import { ChartConfiguration } from 'chart.js';
import { LanguageScore, LOVE_LANGUAGES_DATA } from '../../../core/models';

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.scss'],
})
export class ChartComponent implements OnInit {
  @Input() scores: LanguageScore[] = [];

  public barChartData!: ChartConfiguration<'bar'>['data'];
  public barChartOptions: ChartConfiguration<'bar'>['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            return `${context.parsed.y}%`;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        ticks: {
          callback: function(value) {
            return value + '%';
          }
        }
      }
    }
  };

  ngOnInit() {
    this.prepareChartData();
  }

  ngOnChanges() {
    this.prepareChartData();
  }

  prepareChartData(): void {
    if (!this.scores || this.scores.length === 0) {
      return;
    }

    const labels = this.scores.map(score => {
      const language = LOVE_LANGUAGES_DATA.find(l => l.code === score.code);
      return language ? language.label : score.code;
    });

    const data = this.scores.map(score => score.percentage);

    const backgroundColors = this.scores.map(score => {
      const language = LOVE_LANGUAGES_DATA.find(l => l.code === score.code);
      return language ? language.color : '#cccccc';
    });

    this.barChartData = {
      labels: labels,
      datasets: [
        {
          data: data,
          backgroundColor: backgroundColors,
          borderRadius: 8,
          barThickness: 40
        }
      ]
    };
  }
}