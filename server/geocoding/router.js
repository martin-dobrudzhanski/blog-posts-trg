import express from 'express'
const router = express.Router()

import * as geocode from './controllers/geocode'

router
	.route('/:address')
	.get(geocode.get)


export default router
