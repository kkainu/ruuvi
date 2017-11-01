(() => {
  const http = url => Bacon.fromPromise(fetch(url)).flatMap(result => Bacon.fromPromise(result.json()))
  
  Bacon.once().concat(Bacon.interval(10000)).flatMapLatest(() => http('/api/ruuvi')).onValue(ruuvit => {
    const ruuvitDom = `${ruuvit.map(ruuvi => {
        return `<li>
                  <h3>${ruuvi.location}</h3>
                  <h1>${ruuvi.temperature} °C</h1>
                  <div class="minor-metric">
                    <label>Kosteus: </label><span class="value">${ruuvi.humidity} %</span>
                  </div>
                  <div class="minor-metric">
                    <label>Ilmanpaine: </label><span class="value">${ruuvi.pressure/100} hPa</span>
                  </div>
                  <div class="minor-metric">
                    <label>Paristo: </label><span class="value">${ruuvi.battery/1000} V</span>
                  </div>
                </li>`
    }).join('')}`
    document.getElementById("ruuvit").innerHTML = ruuvitDom
  })
})()