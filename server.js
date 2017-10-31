const ruuvi = require('node-ruuvitag')
const b = require('baconjs')
const db = require('./db')
const express = require('express')
const path = require('path')
const ruuvit = require('./ruuvit.json')

const router = express.Router()
const app = express()

let tags = new Map()

app.use('/api', router)
app.use(express.static(path.join(__dirname + '/public')))

router.get('/ruuvi', (req, res) => res.json(Array.from(tags.values()).sort(sortByName)))

let tagsE = b.fromEvent(ruuvi, 'found')
	.flatMap(t => b.fromEvent(t, 'updated').map(tag => Object.assign({
		id: t.id,
		location: ruuvit[t.id]
	}, tag)))
	.groupBy(tag => tag.id)
	.flatMap(tag => tag.bufferingThrottle(10000))

tagsE.onValue(tag => {
	tags.set(tag.id, tag)
})

app.listen(3333, () => {
	console.log("Ruuvi-server listening on port 3333")
})

const sortByName = (n1, n2) => {
	if (n1 < n2) {
		return -1
	}
	if (n1 > n2) {
		return 1
	}
	return 0
}