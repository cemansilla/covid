<template class="mb-5">
  <b-row>
    <b-col>      
      <b-row class="my-3">
        <b-col>
          <h2>Predicción Argentina a 5 días</h2>
          <b-alert show variant="warning">
            <p>Este modelo no contempla ni los casos recuperados ni las muertes. Apunta a predecir el crecimiento inicial de la pandemia.</p>  
          </b-alert>
        </b-col>
      </b-row>
      <b-row class="my-3">
        <b-col>
          <line-chart
            :chart-data="chartdata"
            :options="options"/>
        </b-col>
      </b-row>      
      <b-row class="my-3">
        <b-col>
          <h2>Resúmen de casos confirmados</h2>
        </b-col>
      </b-row>
      <b-row class="my-3">
        <b-col>
          <b-card title="Casos confirmados" class="text-center">
            <b-card-text>
              <h1>{{total_cases}}</h1>
            </b-card-text>
          </b-card>
        </b-col>
        <b-col>
          <b-card title="Muertes confirmadas" class="text-center">
            <b-card-text>
              <h1>{{total_deaths}}</h1>
            </b-card-text>
          </b-card>
        </b-col>
        <b-col></b-col>
      </b-row>
      <b-row class="my-3">
        <b-col>
          <b-alert show variant="info">
            <p>Info extraída de <a href="https://www.ecdc.europa.eu/en/geographical-distribution-2019-ncov-cases" target="_blank">European Centre for Disease Prevention and Control</a></p>
            <p>Última actualización: {{today()}}</p>
          </b-alert>
        </b-col>
      </b-row>
      <b-row class="my-3">
        <b-col>
          <h2 class="my-3">Explicación de predicción</h2>

          <p>Partimos de <strong>obtener el incremento de casos</strong> para un día dado <i>n</i>, que se obtiene restando el número de casos del día, al número de casos del día siguiente (<i>n + 1</i>)</p>
          <b-img :src="require(`../assets/formulas/1_calculo_nuevos_infectados.png`)" fluid alt="Cálculo nuevos infectados"></b-img>

          <p>Luego, planteamos una fórmula para el cálculo de infectados en el día <i>n</i>, que responde al grado de exposición <b><i>e</i></b> (gente con la que te cruzás), también responde a la probabilidad de contagio <b><i>p</i></b> (acatamiento a las medidas como lavarse las manos, toser en el pliegue del codo, etc) y también depende de la cantidad de infectados en el día dado <b><i>I<sub>n</sub></i></b>.</p>
          <p>Con todo esto se plantea la fórmula: </p>
          <b-img :src="require(`../assets/formulas/2_calculo_causas_nuevos_infectados.png`)" fluid alt="Cálculo nuevos infectados"></b-img>

          <p>Igualamos ambas fórmulas anteriores para detectar el <strong>factor de incremento diario</strong>.</p>
          <b-img :src="require(`../assets/formulas/3_deteccion_factor_incremento.png`)" fluid alt="Detección de factor de incremento diario"></b-img>

          <p>Lo que se concluye en este punto es que la cantidad de infectados de mañana, será igual a la cantidad de infectados de hoy, multiplicada por el factor de incremento diario <b><i>e * p + 1</i></b>. Llamaremos a este factor <b><i>F</i></b></p>
          <b-img :src="require(`../assets/formulas/5_factor_incremento.png`)" fluid alt="Fórmula factor de incremento diario"></b-img>

          <p>Reemplazamos este factor <b><i>F</i></b> en la fórmula obtenida en el primer despeje, despejamos el factor, y esa fórmula es la aplicada en el modelo de este ejercicio, es decir, los infectados del día de hoy, dividido los infectados de ayer. Iterando y multiplicando por este factor es que se realiza la predicción.</p>
          <b-img :src="require(`../assets/formulas/6_formula_factor_incremento.png`)" fluid alt="Fórmula factor de incremento diario para modelo"></b-img>

          <b-alert show variant="warning">
            <p>Lo que resumí acá, pueden verlo perfectamente explicado en el video de <strong>El Traductor de Ingeniería</strong>: <a href="https://www.youtube.com/watch?v=-PUT0hZiZEw" target="_blank">Te Explico POR QUÉ estoy PREOCUPADO | [COVID-19]</a></p>  
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
      start_date: "2020-03-04",
      days_to_predict: 5,
      cases: [1,0,1,6,1,3,0,7,0,12,3,11,11,9,14,18,31,30,67,41,35,86,115,87,101,55,75,146],
      deaths: [0,0,0,0,1,0,0,0,0,0,1,0,0,0,0,0,1,0,1,0,0,2,2,4,5,2,1,4]
    }
  },
  computed: {
    total_cases: function(){
      return this.getCases().slice(-1)[0]
    },
    total_deaths: function(){
      return this.getDeaths().slice(-1)[0]
    },
    chartdata: function(){
      return {
        labels: this.getDaysArray(this.startDate(), this.endDate()), // Días
        datasets: [
          {
            label: 'Predicción Infectados',
            data: this.getForecast(),
            backgroundColor: 'rgba(181, 13, 13, 0.08)',
            borderColor: 'rgba(181, 13, 13, 1)',
            borderWidth: 1,
            order: 1
          },
          {
            type: 'bar',
            label: 'Muertes',
            data: this.getDeaths(),
            backgroundColor: 'rgba(0, 0, 0, 0.6)',
            borderWidth: 1,
            order: 2
          },
          {
            type: 'bar',
            label: 'infectados',
            data: this.getCases(),
            backgroundColor: 'rgba(255, 69, 0, 0.6)',
            borderWidth: 1,
            order: 3
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
            stacked: false,
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
    this.getForecast();
  },
  methods: {
    getGrowthFactor(offset){      
      var cases = this.getCases().splice(offset);

      var values = [];
      let f;
      for(var i = 0; i < cases.length; i++){
        if(i > 0){
          if(typeof cases[i-1] !== "undefined" && cases[i-1] > 0){
            f = cases[i] / cases[i-1]
            values.push(f);
          }          
        }
      }

      return this.getAvg(values);
    },
    getAvg(values){
      let count = values.length;
      values = values.reduce((previous, current) => current += previous);
      values /= count;
      
      return values;
    },
    getForecast(){
      var cases = this.getCases(); // D
      var cases_count = cases.length;
      var forecast_days = cases_count + this.days_to_predict;
      var growth_factor = this.getGrowthFactor(1);

      var i = 0;
      let f = 1;          // Predicción
      let last_f;         // Auxiliar para predicción anterior
      var forecast = [];
      while(i <= forecast_days){
        if(i > 0){
          if(typeof cases[i-1] === "undefined"){
            last_f = forecast.slice(-1)[0] || 1;
          }else{
            last_f = cases[i-1];
          }

          f = growth_factor * last_f;
          forecast.push(Math.round(f));
        }

        i++;
      }

      return forecast;
    },
    getSimulatedForecast(){
      var days_num = this.daysBetweenStartEnd(this.startDate(), this.endDate());

      var forecast = [];
      for(var i = 0; i < days_num; i++){
        forecast.push(i*i);
      }

      return forecast;
    },
    getCases(){
      var values = this.cases;
      var cases = values.reduce((r, a, i) => (r.push((i && r[i - 1] || 0) + a), r), []);

      return cases;
    },
    getDeaths(){
      var values = this.deaths;
      var deaths = values.reduce((r, a, i) => (r.push((i && r[i - 1] || 0) + a), r), []);

      return deaths;
    },
    today(){
      return new Date().toISOString().slice(0,10).split('-').reverse().join('/');
    },
    startDate(){
      return new Date(this.start_date);
    },
    endDate(){
      return new Date(new Date().setDate(new Date().getDate() + this.days_to_predict));
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