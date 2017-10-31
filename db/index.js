const Influx = require('influx')
const os = require('os')

const influx = new Influx.InfluxDB({
  host: 'localhost',
  database: 'ruuvi_db',
  schema: [
    {
      measurement: 'ruuvi_tags',
      fields: {
        path: Influx.FieldType.STRING,
        duration: Influx.FieldType.INTEGER
      },
      tags: [
        'host'
      ]
    }
  ]
})

/* influx.getDatabaseNames()
  .then(names => {
    if (!names.includes('express_response_db')) {
      return influx.createDatabase('express_response_db');
    }
  })

influx.writePoints([
  {
    measurement: 'response_times',
    tags: { host: os.hostname() },
    fields: { duration: 1, path: '/my/path' },
  }
]).then(() => {
  return influx.query(`
    select * from response_times
    where host = ${Influx.escape.stringLit(os.hostname())}
    order by time desc
    limit 10
  `)
}).then(rows => {
  rows.forEach(row => console.log(`A request to ${row.path} took ${row.duration}ms`))
}) */

module.exports = {}
