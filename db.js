const Influx = require('influx')
const b = require('baconjs')

const influx = new Influx.InfluxDB({
  host: 'localhost',
  database: 'ruuvi_db'
})

const record = tag => {
  return influx.writePoints([
    {
      measurement: 'ruuvi_tags',
      tags: {
        id: tag.id,
        location: tag.location
      },
      fields: {
        rssi: tag.rssi,
        humidity: tag.humidity,
        temperature: tag.temperature,
        pressure: tag.pressure,
        accelerationX: tag.accelerationX,
        accelerationY: tag.accelerationY,
        accelerationZ: tag.accelerationZ,
        accelerationTotal: tag.accelerationTotal,
        battery: tag.battery
      }
    }
  ]).then(() => console.log(JSON.stringify(tag)))
}

const temps = duration => {
  const query = `SELECT mean("temperature") from ruuvi_tags where time> now() - ${duration} GROUP BY time(1m), location`
  return influx.query(query)
}

module.exports = {
  record: tag => b.fromPromise(record(tag)),
  temps: duration => b.fromPromise(temps(duration))
}
