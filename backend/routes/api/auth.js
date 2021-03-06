import express from 'express'
import {User} from './models'
import bcrypt from 'bcrypt'

export function auth(req, res, next) {
	if (req.session && req.session.name != null) {
		return next()
	} else {
		return res.sendStatus(401)
	}
}

export default ({config}) => {
	const router = express.Router()

	router.get('/', auth, (req, res) => {
		res.send({status: 'OK', name: req.session.name})
	})

	router.post('/login', (req, res) => {
		User.findOne({name: req.body.name, password: bcrypt.hashSync(req.body.password, config.salt)},
			(err, user) => {
				if (user == null) {
					res.send({error: 'Log in error'})
				} else {
					req.session.name = user.name
					req.session.userid = user.id
					req.session.user = user
					res.send({status: 'OK', name: req.session.name})
				}
			}
		)
	})

	router.post('/logout', auth, (req, res) => {
		req.session.name = null
		req.session.user = null
		res.send({status: 'OK'})
	})

	return router
}
