import express from 'express'
import {Device} from './models'
import {auth} from './auth'

export default () => {
	const router = express.Router()

	router.get('/', (req, res) => {
		Device.find((err, data) => {
			if (err) {
				res.send(err)
			} else {
				res.json(data)
			}
		})
	})

	router.get('/:id', (req, res) => {
		Device.findById(req.params.id, (err, measurement) => {
			if (err) {
				res.send(err)
			} else {
				res.json(measurement)
			}
		})
	})

	router.post('/', auth,(req, res) => {
		let device = new Device()
		device.owner = req.session.user
		device.password = req.body.password
		device.save((err) => {
			if (err) {
				res.send(err)
			} else {
				res.json(device)
			}
		})
	})

	//TODO: PUT, DELETE
	return router
}