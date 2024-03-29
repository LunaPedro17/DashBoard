import {
  tiempoArr,
  precipitacionArr,
  uvArr,
  temperaturaArr,
} from "./static_data.js";

let fechaActual = () => new Date().toISOString().slice(0, 10);

let cargarPrecipitacion = () => {
  // Obtener la fecha actual
  let actual = fechaActual(); // Esto te da la fecha y hora actual

  // Definir un arreglo temporal vacío
  let datos = [];

  // Iterar en el arreglo tiempoArr para filtrar los valores de precipitacionArr que sean iguales a la fecha actual
  for (let index = 0; index < tiempoArr.length; index++) {
    const tiempo = tiempoArr[index];
    const precipitacion = precipitacionArr[index];

    if (tiempo.includes(actual)) {
      datos.push(precipitacion);
    }
  }

  // Con los valores filtrados, obtener los valores máximo, promedio y mínimo
  let max = Math.max(...datos);
  let min = Math.min(...datos);
  let sum = datos.reduce((a, b) => a + b, 0);
  let prom = sum / datos.length || 0;

  // Obtener la referencia a los elementos HTML con id precipitacionMinValue, precipitacionPromValue y precipitacionMaxValue
  let precipitacionMinValue = document.getElementById("precipitacionMinValue")
  let precipitacionPromValue = document.getElementById("precipitacionPromValue")
  let precipitacionMaxValue = document.getElementById("precipitacionMaxValue")

  // Actualizar los elementos HTML con los valores correspondientes
  precipitacionMinValue.textContent = `Min ${min} [mm]`
  precipitacionPromValue.textContent = `Prom ${Math.round(prom * 100) / 100} [mm]`
  precipitacionMaxValue.textContent = `Max ${max} [mm]`
};

// Llamar a la función para cargar los datos de precipitación


let cargarFechaActual = () => {

  //Obtenga la referencia al elemento h6
  let coleccionHTML = document.getElementsByTagName("h6")

  let tituloH6 = coleccionHTML[0]
  //Actualice la referencia al elemento h6 con el valor de la función fechaActual()
  tituloH6.textContent = fechaActual()
}




let cargarOpenMeteo = () => {

  //URL que responde con la respuesta a cargar
  let URL = 'https://api.open-meteo.com/v1/forecast?latitude=-2.1962&longitude=-79.8862&hourly=temperature_2m,precipitation_probability&daily=uv_index_max&timezone=auto';

  fetch(URL)
    .then(responseText => responseText.json())
    .then(responseJSON => {

      console.log(responseJSON);
      //Respuesta en formato JSON

      //Referencia al elemento con el identificador plot
      let plotRef = document.getElementById('plot1');
      let plotRef2 = document.getElementById('plot2');
      let plotRef3 = document.getElementById('plot3');
      //Etiquetas del gráfico

      //cada 3 horas
      let label = [];


      let labels = responseJSON.hourly.time;
      let label2 = responseJSON.daily.time;
      //Etiquetas de los datos
      //let data = responseJSON.hourly.temperature_2m; //forma normal
      let data2 = responseJSON.hourly.precipitation_probability;
      let data3 = responseJSON.daily.uv_index_max;



      //cada 3 horas
      let data1 = [];


      //OBTENER CADA 3 HORAS
      responseJSON.hourly.time.forEach((hourlyData, index) => {
        if (index % 3 === 0 && index < 24) {
          label.push(hourlyData);
          data1.push(responseJSON.hourly.temperature_2m[index]);

        }
      });

      //Objeto de configuración del gráfico forma normal
      /*let config = {
        type: 'line',
        data: {
          labels: labels, 
          datasets: [
            {
              label: 'Temperature [2m]',
              data: data, 
            }
          ]
        }
      };*/
      let config2 = {
        type: 'line',
        data: {
          labels: labels,
          datasets: [
            {
              label: 'Probabilidad de Precipitación',
              data: data2,
              borderColor:'rgb(144, 238, 144)'
            }
          ]
        }
      };
      let config3 = {
        type: 'line',
        data: {
          labels: label2,
          datasets: [
            {
              label: 'Rayos UV',
              data: data3,
              borderColor: 'rgb(75, 192, 192)', // Color de la línea
              borderWidth: 2, // Ancho de la línea en píxeles
              fill: true, // Si quieres rellenar el área debajo de la línea
            }
          ]
        }
      };
      //Objeto de configuración del gráfico
      let config4 = {
        type: 'bar',
        data: {
          labels: label,
          datasets: [
            {
              label: 'Temperatura cada 3 horas',
              data: data1,
              fill: false,
              borderColor: 'rgba(25, 19, 70, 0.5)',
              backgroundColor: 'rgba(205, 129,324, 0.5)',
              borderWidth: 1,
              pointRadius: 5,
              pointBorderColor: 'rgb(0, 0, 0)'
            }
          ]
        },
        plugins: {
          legend: {
            labels: {
              responsive: true,
              usePointStyle: true,
              maintainAspectRatio: true,
              text: (ctx) => 'Point Style: ' + ctx.chart.data.datasets[0].pointStyle,
            },
          }
        }
      };


      //Objeto con la instanciación del gráfico
      //let chart1 = new Chart(plotRef, config);
      let chart2 = new Chart(plotRef2, config2);
      let chart3 = new Chart(plotRef3, config3)
      let chart4 = new Chart(plotRef, config4);
    })
    .catch(console.error);
}



/*
let parseXML = (responseText) => {
  
  // Parsing XML
  const parser = new DOMParser();
  const xml = parser.parseFromString(responseText, "application/xml");

  console.log(xml)

}

//Callback
let selectListener = (event) => {

  let selectedCity = event.target.value
  console.log(selectedCity);
  
}
*/


let loadForecastByCity = () => {

  //Handling event
  let selectElement = document.querySelector("select")
  selectElement.addEventListener("change", selectListener)
}





//de forma asincrónica
// Callback async
let selectListener = async (event) => {

  let selectedCity = event.target.value
  // Lea la entrada de almacenamiento local
  let cityStorage = localStorage.getItem(selectedCity);

  if (cityStorage == null) {
    try {

      //API key
      let APIkey = '9d2fae962db0f1ba97ba5d8e606df0b9'
      let url = `https://api.openweathermap.org/data/2.5/forecast?q=${selectedCity}&mode=xml&appid=${APIkey}`

      let response = await fetch(url)
      let responseText = await response.text()

      await parseXML(responseText)

      // Guarde la entrada de almacenamiento local
      await localStorage.setItem(selectedCity, responseText)

    } catch (error) {
      console.log(error)
    }
  } else {
    // Procese un valor previo
    parseXML(cityStorage)
  }

}


let parseXML = (responseText) => {

  const parser = new DOMParser();
  const xml = parser.parseFromString(responseText, "application/xml");


  // Referencia al elemento `#forecastbody` del documento HTML

  let forecastElement = document.querySelector("#forecastbody")
  forecastElement.innerHTML = ''

  // Procesamiento de los elementos con etiqueta `<time>` del objeto xml
  let timeArr = xml.querySelectorAll("time")

  timeArr.forEach(time => {

    let from = time.getAttribute("from").replace("T", " ")

    let humidity = time.querySelector("humidity").getAttribute("value")
    let windSpeed = time.querySelector("windSpeed").getAttribute("mps")
    let precipitation = time.querySelector("precipitation").getAttribute("probability")
    let pressure = time.querySelector("pressure").getAttribute("value")
    let cloud = time.querySelector("clouds").getAttribute("all")

    let template = `
          <tr>
              <td>${from}</td>
              <td>${humidity}</td>
              <td>${windSpeed}</td>
              <td>${precipitation}</td>
              <td>${pressure}</td>
              <td>${cloud}</td>
          </tr>
      `

    //Renderizando la plantilla en el elemento HTML
    forecastElement.innerHTML += template;
  })

}





let loadExternalTable = async() => {
  
  //Requerimiento asíncrono

    console.log("Gestion de riesgos")
  
    let proxy = 'https://cors-anywhere.herokuapp.com/'
    let URL = proxy + 'https://www.gestionderiesgos.gob.ec/monitoreo-de-inundaciones/'
  
    let response= await fetch(URL)
    let responseText= await response.text()
  
    const parser=await new DOMParser();
    const xml= await parser.parseFromString(responseText,"text/html");
  
    let table=await xml.querySelector("#postcontent table")
  
    document.getElementById("monitoreo").innerHTML= table.outerHTML
  
  
  
 }
 
loadExternalTable();





loadForecastByCity();

cargarPrecipitacion();
cargarFechaActual();
cargarOpenMeteo();

