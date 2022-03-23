import express from 'express'
const router = express.Router()

import * as staticCtrl from './controllers/static'

router
	.route('/book-widget/:restId')
	.get(staticCtrl.renderBookWidget)

router
	.route('/book-widget/')
	.get(staticCtrl.renderBookWidget)

router
	.route('/liveres')
	.get(staticCtrl.renderLiveres)

router
	.route('/liveres/complete')
	.get(staticCtrl.renderLiveresComplete)

export default router
