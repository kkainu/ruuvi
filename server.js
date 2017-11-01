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

const tagsById = b.fromEvent(ruuvi, 'found')
	.flatMap(t => b.fromEvent(t, 'updated').map(tag => Object.assign({
		id: t.id,
		location: ruuvit[t.id]
	}, tag)))
	.groupBy(tag => tag.id)

tagsById.flatMap(tag => throttleImmediately(tag, 10000)).onValue(tag => tags.set(tag.id, tag))

tagsById.flatMap(tag => throttleImmediately(tag, 60000)).flatMap(tag => db.record(tag)).onValue()

app.listen(3333, () => {
	console.log("Ruuvi-server listening on port 3333")
})

const throttleImmediately = (p, time) => p.first().concat(p.throttle(time))

const alphabeticSort = (n1, n2) => {
	if (n1 < n2) { return -1 }
	if (n1 > n2) { return 1 }
	return 0
}