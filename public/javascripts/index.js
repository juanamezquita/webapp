
$(document).ready(function () {

  var timeData = [],
    temperatureData = [],
    humidityData = [],
    voltajeData = [],
    corrienteData=[]
    ;

  var data = {
    labels: timeData,
    datasets: [
      {
        fill: false,
        label: 'Temperatura',
        yAxisID: 'Temperature',
        borderColor: "rgba(255, 204, 0, 1)",
        pointBoarderColor: "rgba(255, 204, 0, 1)",
        backgroundColor: "rgba(255, 204, 0, 0.4)",
        pointHoverBackgroundColor: "rgba(255, 204, 0, 1)",
        pointHoverBorderColor: "rgba(255, 204, 0, 1)",
        data: temperatureData
      },
      {
        fill: false,
        label: 'Humedad',
        yAxisID: 'Humidity',
        borderColor: "rgba(24, 120, 240, 1)",
        pointBoarderColor: "rgba(24, 120, 240, 1)",
        backgroundColor: "rgba(24, 120, 240, 0.4)",
        pointHoverBackgroundColor: "rgba(24, 120, 240, 1)",
        pointHoverBorderColor: "rgba(24, 120, 240, 1)",
        data: humidityData
      }
    ]
  }



  var data2 = {
    labels: timeData,
    datasets: [
      {
        fill: true,
        label: 'Voltaje',
        yAxisID: 'Voltaje',
        borderColor: "rgba(122, 89, 49, 1)",
        pointBoarderColor: "rgba(122, 89, 49, 1)",
        backgroundColor: "rgba(122, 89, 49, 0.4)",
        pointHoverBackgroundColor: "rgba(122, 89, 49, 1)",
        pointHoverBorderColor: "rgba(122, 89, 49, 1)",
        data: voltajeData
      },
      {
        fill: true,
        label: 'Corriente',
        yAxisID: 'Corriente',
        borderColor: "rgba(236, 14, 14, 1)",
        pointBoarderColor: "rgba(236, 14, 14, 1)",
        backgroundColor: "rgba(236, 14, 14, 0.4)",
        pointHoverBackgroundColor: "rgba(236, 14, 14, 1)",
        pointHoverBorderColor: "rgba(236, 14, 14, 1)",
        data: corrienteData
      }
    ]
  }


  var basicOption = {
    title: {
      display: true,
      text: 'Temperatura & Humedad en tiempo Real',
      fontSize: 36
    },
    scales: {
      yAxes: [{
        id: 'Temperature',
        type: 'linear',
        scaleLabel: {
          labelString: 'Temperatura(C)',
          display: true
        },
        position: 'left',
      }, {
          id: 'Humidity',
          type: 'linear',
          scaleLabel: {
            labelString: 'Humedad(%)',
            display: true
          },
          position: 'right'
        }]
    }
  }



    var basicOption2 = {
      title: {
        display: true,
        text: 'Voltaje & Corriente en tiempo Real',
        fontSize: 36
      },
      scales: {
        yAxes: [{
          id: 'Voltaje',
          type: 'linear',
          scaleLabel: {
            labelString: 'Voltaje(V)',
            display: true
          },
          position: 'left',
        }, {
            id: 'Corriente',
            type: 'linear',
            scaleLabel: {
              labelString: 'Corriente(A)',
              display: true
            },
            position: 'right'
          }]
      }
    }



  //Get the context of the canvas element we want to select
  //var ctx = document.getElementById("myChart").getContext("2d");
  var ctx = document.getElementById("chart-0").getContext("2d");
   var optionsNoAnimation = { animation: false }
  var myLineChart = new Chart(ctx, {
    type: 'line',
    data: data,
    options: basicOption
  });

  var ctx2 = document.getElementById("chart-1").getContext("2d");
   var optionsNoAnimation2 = { animation: false }
  var myLineChart2 = new Chart(ctx2, {
    type: 'line',
    data: data2,
    options: basicOption2
  });


  var ws = new WebSocket('wss://' + location.host);
  ws.onopen = function () {
    console.log('Successfully connect WebSocket');
  }
  ws.onmessage = function (message) {
    console.log('receive message' + message.data);
    try {
      var obj = JSON.parse(message.data);
      if(!obj.time || !obj.temperature) {
        return;
      }
      timeData.push(obj.time);
      temperatureData.push(obj.temperature);
      // only keep no more than 50 points in the line chart
      const maxLen = 50;
      var len = timeData.length;
      if (len > maxLen) {
        timeData.shift();
        temperatureData.shift();
      }
      if (obj.humidity) {
        humidityData.push(obj.humidity);
      }
      if (humidityData.length > maxLen) {
        humidityData.shift();
      }
      if (obj.voltaje) {
        voltajeData.push(obj.voltaje);
      }
      if (voltajeData.length > maxLen) {
        voltajeData.shift();
      }
      if (obj.corriente) {
        corrienteData.push(obj.corriente);
      }
      if (corrienteData.length > maxLen) {
        corrienteData.shift();
      }


      myLineChart2.update();
      myLineChart.update();
    } catch (err) {
      console.error(err);
    }
  }
});
