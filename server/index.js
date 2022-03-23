import appConfig from './config/app'

const express = require('express')

import { Nuxt, Builder } from 'nuxt'
import morgan from 'morgan'
import bodyParser from 'body-parser'
import tlsRedirect from 'express-https-redirect'
import helmet from 'helmet'
import path from 'path'
import api from './api'
import * as restaurantFeeds from './static/controllers/restaurantFeeds'

const expressRedirect = require('express-redirect')
var reporter = require('node-health-service').Reporter();

const app = express()
const host = process.env.HOST || '127.0.0.1'
const port = process.env.PORT || 3000

app.use((req, res, next) => {
	res.header("Access-Control-Allow-Origin", "https://bookings.liveres.co.uk")
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
	next()
})

app.use(helmet({
	xssFilter: false
}))
app.use('/', tlsRedirect())
app.use(require('express-naked-redirect')())

expressRedirect(app)

const activateRedirects = require('./redirects/index')
activateRedirects(app)

app.use(reporter.monitor);

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname + '/static/assets'));

app.use(morgan(`STATUS::status :method :url -- :remote-addr :remote-user HTTP/:http-version :res[content-length] - :response-time ms`))
app.set('port', port)

app.get('/status/healthcheck', (req, res) => res.status(200).send() )

app.get('/status/error-detail', reporter.lastError)

app.use('/api', api)


app.get('/trg_restaurant_feed/JSON', restaurantFeeds.restaurantFeeds)

app.get('/trg_restaurant_feed_full/JSON', restaurantFeeds.restaurantFeedsFull)

let config = require('../nuxt.config.js')
config.dev = !(appConfig.NODE_ENV === 'production')
const nuxt = new Nuxt(config)

if (config.dev) {
  const builder = new Builder(nuxt)
  builder.build()
}

app.use(nuxt.render)

app.listen(port, host, () => {
	console.log('Server listening on ' + host + ':' + port) // eslint-disable-line no-console
	console.log('Node Env: ' + appConfig.NODE_ENV)
	console.log('CC Env: ' + appConfig.CC_ENV)
	console.log('OAT Env: ' + appConfig.OAT_ENV)
	console.log('OA Env: ' + appConfig.OA_ENV)
	console.log('App Env: ' + (appConfig.APP_ENV || 'DEV'))
})
