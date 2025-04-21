const lat = 14.695151709155798;
const lon = 121.11788215916273;
const apiKey = "662bc47b0b806958a77b4b260951abb8";

// function updateWindyMap(layer) {
//   const url = `https://embed.windy.com/embed2.html?lat=${lat}&lon=${lon}&detailLat=${lat}&detailLon=${lon}&zoom=18&level=surface&overlay=${layer}&menu=true&message=true&marker=true&calendar=off&pressure=true&type=map&location=coordinates&detail=true&metricWind=default&metricTemp=default`;
//   document.getElementById("windy").src = url;
// }

// document.getElementById("layerSelect").addEventListener("change", (e) => {
//   updateWindyMap(e.target.value);
// });

// updateWindyMap("clouds");

// Weather Cards
fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`)
  .then(res => res.json())
  .then(data => {
    const iconCode = data.weather[0].icon;
    const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;

    const cards = [
      {
        label: "Weather Condition",
        value: data.weather[0].description,
        icon: `<img src="${iconUrl}" alt="condition" title="${data.weather[0].description}" width="80" height="50" />`
      },
      {
        label: "Temperature",
        value: `${data.main.temp} °C`,
        icon: `<i class="wi wi-thermometer text-danger fs-3" title="Temperature"></i>`
      },
      {
        label: "Feels Like",
        value: `${data.main.feels_like} °C`,
        icon: `<i class="wi wi-hot text-warning fs-3" title="Feels Like"></i>`
      },

        {
            label: "Min Temp",
            value: `${data.main.temp_min.toFixed(1)} °C`,
            icon: `<i class="wi wi-direction-down text-primary fs-3" title="Minimum Temperature"></i>`
        },

        {
            label: "Max Temp",
            value: `${data.main.temp_max.toFixed(1)} °C`,
            icon: `<i class="wi wi-direction-up text-danger fs-3" title="Maximum Temperature"></i>`
        },


      {
        label: "Humidity",
        value: `${data.main.humidity}%`,
        icon: `<i class="wi wi-humidity text-info fs-3" title="Humidity"></i>`
      },
      {
        label: "Pressure",
        value: `${data.main.pressure} hPa`,
        icon: `<i class="wi wi-barometer text-secondary fs-3" title="Pressure"></i>`
      },
      {
        label: "Wind Speed",
        value: `${data.wind.speed} m/s`,
        icon: `<i class="wi wi-strong-wind text-primary fs-3" title="Wind Speed"></i>`
      },
      {
        label: "Wind Direction",
        value: `${data.wind.deg}°`,
        icon: `<i class="wi wi-wind from-${Math.round(data.wind.deg)}-deg text-success fs-3" title="Wind Direction"></i>`
      },

      {
        label: "Wind Gust",
        value: data.wind.gust ? `${data.wind.gust.toFixed(1)} m/s` : "N/A",
        icon: `<i class="wi wi-windy text-info fs-3" title="Wind Gust"></i>`
        },

      {
        label: "Clouds",
        value: `${data.clouds.all}%`,
        icon: `<i class="wi wi-cloudy text-muted fs-3" title="Cloud Coverage"></i>`
      },

      {
        label: "Sunrise",
        value: new Date(data.sys.sunrise * 1000).toLocaleTimeString("en-PH", { hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Manila' }),
        icon: `<i class="wi wi-sunrise text-warning fs-3" title="Sunrise"></i>`
      },
      {
        label: "Sunset",
        value: new Date(data.sys.sunset * 1000).toLocaleTimeString("en-PH", { hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Manila' }),
        icon: `<i class="wi wi-sunset text-orange fs-3" title="Sunset"></i>`
      },
      {
        label: "Last Update",
        value: new Date(data.dt * 1000).toLocaleString("en-PH", {
            timeZone: "Asia/Manila",
            hour: "2-digit",
            minute: "2-digit",
            day: "numeric",
            month: "short"
        }),
        icon: `<i class="wi wi-time-3 text-dark fs-3" title="Last Updated"></i>`
    }

    ];

    const row = document.getElementById("weatherCardRow");
    row.innerHTML = cards.map(card => `
      <div class="card shadow-sm border-0 weather-card" data-bs-toggle="tooltip" title="${card.label}: ${card.value}">
        <div class="card-body text-center">
          <div class="mb-2">${card.icon}</div>
          <div class="fw-semibold text-muted small text-wrap">${card.label}</div>
          <div class="fs-6 fw-bold text-dark text-wrap">${card.value}</div>
        </div>
      </div>
    `).join("");

    const tooltips = document.querySelectorAll('[data-bs-toggle="tooltip"]');
    [...tooltips].forEach(el => new bootstrap.Tooltip(el));
  });
   // Forecast Charts
   fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`)
    .then(res => res.json())
    .then(data => {
      const labels5d = [], temps5d = [];
      const labelsHr = [], tempsHr = [], hourlyData = [];

      data.list.forEach((item, index) => {
        const dt = new Date(item.dt * 1000);
        const label = dt.toLocaleString("en-PH", { hour: "2-digit", day: "numeric", month: "short" });
        labels5d.push(label);
        temps5d.push(item.main.temp);

        if (index < 4) {
          labelsHr.push(dt.toLocaleTimeString("en-PH", { hour: "2-digit", minute: "2-digit" }));
          tempsHr.push(item.main.temp);
          hourlyData.push({
            temp: item.main.temp,
            feels_like: item.main.feels_like,
            humidity: item.main.humidity,
            condition: item.weather[0].description
          });
        }
      });

      new Chart(document.getElementById("forecastChart"), {
        type: 'line',
        data: {
          labels: labels5d,
          datasets: [{
            label: 'Temp (°C)',
            data: temps5d,
            borderColor: '#ff6f00',
            backgroundColor: 'rgba(255, 111, 0, 0.1)',
            tension: 0.4,
            pointRadius: 4,
            pointBackgroundColor: '#ff6f00',
            fill: true
          }]
        },
        options: {
          responsive: true,
          plugins: {
            legend: { display: false },
            datalabels: {
              anchor: 'end',
              align: 'top',
              color: '#333',
              font: { weight: 'bold' },
              formatter: v => `${v.toFixed(1)}°`
            }
          }
        },
        plugins: [ChartDataLabels]
      });

      new Chart(document.getElementById("hourlyChart"), {
        type: 'bar',
        data: {
          labels: labelsHr,
          datasets: [{
            label: 'Temp (°C)',
            data: tempsHr,
            backgroundColor: 'rgba(0,123,255,0.7)'
          }]
        },
        options: {
          responsive: true,
          plugins: {
            legend: { display: false },
            tooltip: {
              callbacks: {
                label: (ctx) => {
                  const i = ctx.dataIndex;
                  const h = hourlyData[i];
                  return [
                    `Temp: ${h.temp.toFixed(1)} °C`,
                    `Feels Like: ${h.feels_like.toFixed(1)} °C`,
                    `Humidity: ${h.humidity}%`,
                    `Condition: ${h.condition}`
                  ];
                }
              }
            },
            datalabels: {
              anchor: 'end',
              align: 'top',
              color: '#000',
              font: { size: 10, weight: 'bold' },
              formatter: v => `${v.toFixed(1)}°`
            }
          },
          scales: {
            x: {
              ticks: {
                font: { size: 10 },
                maxRotation: 45,
                minRotation: 30
              }
            }
          }
        },
        plugins: [ChartDataLabels]
      });
    });


    function showWeatherPopup() {
        fetch(`https://api.openweathermap.org/data/2.5/weather?lat=14.695151709155798&lon=121.11788215916273&appid=662bc47b0b806958a77b4b260951abb8&units=metric`)
            .then(res => res.json()) // parse the response
            .then(data => {
            const html = `
                <p><strong>Temp:</strong> ${data.main.temp} °C</p>
                <p><strong>Feels Like:</strong> ${data.main.feels_like} °C</p>
                <p><strong>Humidity:</strong> ${data.main.humidity}%</p>
                <p><strong>Condition:</strong> ${data.weather[0].description}</p>`;
            document.getElementById("modalWeatherInfo").innerHTML = html;
            new bootstrap.Modal(document.getElementById("weatherModal")).show();
            });
        }



const apiUrl = `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&exclude=hourly,minutely&appid=${apiKey}&units=metric`;


fetch(apiUrl)
  .then(response => response.json())
  .then(data => {
    const daily = data.daily;
    const tableBody = document.getElementById("forecastTableBody");

    tableBody.innerHTML = daily.map(day => {
      const date = new Date(day.dt * 1000).toLocaleDateString("en-PH", { weekday: 'short', month: 'short', day: 'numeric' });
      const iconUrl = `https://openweathermap.org/img/wn/${day.weather[0].icon}.png`;
      return `
        <tr>
          <td>${date}</td>
          <td>${day.summary}</td>
          <td><img src="${iconUrl}" class="weather-icon" alt="${day.weather[0].description}"></td>
          <td>${day.temp.min.toFixed(1)} / ${day.temp.max.toFixed(1)}</td>
          <td>${day.feels_like.day.toFixed(1)} / ${day.feels_like.night.toFixed(1)}</td>
          <td>${day.humidity}%</td>
          <td>${day.pressure} hPa</td>
          <td>${day.clouds}%</td>
          <td>${day.wind_speed.toFixed(1)} / ${day.wind_gust ? day.wind_gust.toFixed(1) : '–'}</td>
          <td>${(day.pop * 100).toFixed(0)}%</td>
          <td>${day.rain ? day.rain.toFixed(1) : '0.0'}</td>
          <td>${day.uvi}</td>
        </tr>`;
    }).join('');
  });

//   function getWeatherEmoji(condition) {
//   const lower = condition.toLowerCase();
//   if (lower.includes("rain")) return "🌧️";
//   if (lower.includes("cloud")) return "⛅";
//   if (lower.includes("clear")) return "☀️";
//   if (lower.includes("thunder")) return "🌩️";
//    return "🌤️"; // default
// }


Main weather updater
function refreshSanMateoWeather() {
fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`)
  .then(res => res.json())
  .then(data => {
    // const temp = Math.round(data.main.temp);
    // const icon = getWeatherEmoji(data.weather[0].description);
    // const label = document.getElementById("sanMateoMarker");
    // label.innerHTML = `📍 San Mateo ${temp}° ${icon}`;
    // label.style.opacity = 1;


    // ✅ Show success toast
    const toast = new bootstrap.Toast(document.getElementById('refreshToast'));
    toast.show();
  });
}


// Initial load
refreshSanMateoWeather();
