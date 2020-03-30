<template>
  <b-row>
    <b-col>
      <h2 class="my-3">Situación Argentina</h2>
      <b-row>
        <b-col>
          <line-chart
            :chart-data="chartdata"
            :options="options"/>
        </b-col>
      </b-row>
      <b-row class="mt-3">
        <b-col>
          <b-alert show variant="info">
            <p>Info extraída de <a href="https://www.ecdc.europa.eu/en/geographical-distribution-2019-ncov-cases" target="_blank">European Centre for Disease Prevention and Control</a></p>
            <p>Última actualización: {{today()}}</p>
          </b-alert>
        </b-col>
      </b-row>
    </b-col>
  </b-row>
</template>

<script>
import LineChart from './charts/LineChart.js'

export default {
  name: 'DashboardPage',
  components: {
    LineChart
  },
  data(){
    return{
      start_date: "2020-03-04"
    }
  },
  computed: {   
    chartdata: function(){
      return {
        labels: this.getDaysArray(this.startDate(), this.endDate()), // Días
        datasets: [          
          {
            type: 'bar',
            label: 'infectados',
            data: this.getCases(),
            backgroundColor: 'rgba(99, 33, 132, 0.2)',
            borderColor: 'rgba(255,99,132,1)',
            borderWidth: 1
          },
          {
            type: 'bar',
            label: 'Muertes',
            data: this.getDeaths(),
            backgroundColor: 'rgba(255, 99, 132, 0.2)',
            borderColor: 'rgba(255,99,132,1)',
            borderWidth: 1
          },
          {
            label: 'Predicción Infectados',
            data: new Array(this.daysBetweenStartEnd(this.startDate(), this.endDate())), // TODO: Calcular data en base a fórmula
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1
          }
        ]
      }
    },
    options: function(){
      return {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          xAxes: [{
            display: true,
            stacked: true,
            scaleLabel: {
              display: true,
              labelString: 'Días'
            },
          }],
          yAxes: [{
            display: true,
            stacked: true,
            scaleLabel: {
              display: true,
              labelString: 'Casos'
            },
            ticks: {
              beginAtZero: true,
            }
          }]
        }
      }
    }
  },
  mounted(){
    //this.fillData()
  },
  methods: {
    getCases(){
      return [1,0,1,6,1,3,0,7,0,12,3,11,11,9,14,18,31,30,67,41,35,86,115,87,101,55];
    },
    getDeaths(){
      return [0,0,0,0,1,0,0,0,0,0,1,0,0,0,0,0,1,0,1,0,0,2,2,4,5,2];
    },
    today(){
      return new Date().toISOString().slice(0,10).split('-').reverse().join('/');
    },
    startDate(){
      return new Date(this.start_date);
    },
    endDate(){
      return new Date(new Date().setDate(new Date().getDate()-1));
    },
    getDaysArray(s, e){
      for(var a=[], d=s; d<=e; d.setDate(d.getDate()+1)){
        a.push(
          new Date(d).toISOString().slice(0,10).split('-').reverse().join('/')
        );
      }
      return a;
    },
    daysBetweenStartEnd(s, e){
      const utc1 = Date.UTC(s.getFullYear(), s.getMonth(), s.getDate());
      const utc2 = Date.UTC(e.getFullYear(), e.getMonth(), e.getDate());

      return Math.floor((utc2 - utc1) / (1000 * 60 * 60 * 24));
    }
  }
}
</script>

<style>
</style>