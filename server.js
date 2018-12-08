const ruuvi = require('node-ruuvitag')
const b = require('baconjs')
const db = require('./db.js')
const express = require('express')
const path = require('path')
const ruuvit = require('./ruuvit.json')

const router = express.Router()
const app = express()

let tags = new Map()

app.use('/api', router)
app.use(express.static(path.join(__dirname + '/public')))

router.get('/ruuvi', (req, res) => res.json(Array.from(tags.values()).sort(alphabeticSort)))
router.get('/ruuvi/temps/:duration', (req, res) => {
  console.log(req.params)
  return db.temps(req.params.duration).onValue(temps => res.json(temps))}
)

const tagsById = b.fromEvent(ruuvi, 'found')
  .flatMap(t => b.fromEvent(t, 'updated').map(tag => Object.assign({
    id: t.id,
    location: ruuvit[t.id],
    accelerationTotal: Math.round(Math.sqrt(Math.pow(tag.accelerationX,2) + Math.pow(tag.accelerationY,2) + Math.pow(tag.accelerationZ,2)))
  }, tag)))
  .groupBy(tag => tag.id)

tagsById.onError(e => console.log(e))

const throttleImmediately = time => (p) => p.first().concat(p.throttle(time))

tagsById.flatMap(throttleImmediately(10000)).onValue(tag => tags.set(tag.id, tag))

const writeToDb = tagsById.flatMap(throttleImmediately(60000)).flatMap(tag => db.record(tag))
writeToDb.onError(e => console.log(e))

app.listen(3333, () => {
  console.log("Ruuvi-server listening on port 3333")
})

const alphabeticSort = (n1, n2) => {
  if (n1 < n2) { return -1 }
  if (n1 > n2) { return 1 }
  return 0
}
