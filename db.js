const Influx = require('influx')
const b = require('baconjs')

const influx = new Influx.InfluxDB({
  host: 'localhost',
  database: 'ruuvi_db'
})

const dbPromise = influx.getDatabaseNames().then(names => {
  if (!names.includes('ruuvi_db')) {
    return influx.createDatabase('ruuvi_db');
  }
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
  ]).then(() => console.log('wrote' + JSON.stringify(tag) + ' to influxdb'))
}

module.exports = {
  connection: b.fromPromise(dbPromise),
  record: tag => b.fromPromise(record(tag))
}
