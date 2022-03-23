import { Router } from 'express'
import cmsEndpoints from '../cms/router'
import staticEndpoints from '../static/router'
import geocodingEndpoints from '../geocoding/router'
import liveResEndpoints from '../liveres/router'
import apiCache from 'apicache'
import request from 'request'
import redis from 'redis'

const router = Router()

const clearWafCache = () => {
  request(process.env.WAF_CACHE_URL, (err, res) => {
    if (!err) {
      console.log('WAF Cache: Flush Started')
    }
  })
}

let redisClient = null
let redisClientConnected = false

apiCache.options({ debug: process.env.REDIS_DEBUG_MODE === 'true' })

router.post('/cache-reset', (req, res) => {
  if (redisClientConnected) {
    console.log('Redis Cache: Flush Started')

    res.status(200).send()

    redisClient.flushdb((err, succeeded) => {
      if (err) {
        console.error('Redis Cache explicit flush was unsuccessful', err)
      } else {
        console.log(`Redis Cache explicit flush: ${succeeded}`)

        setTimeout(clearWafCache, 15000)
      }
    })
  } else {
    console.error('Redis Client not connected')

    res.status(500).send()
  }
})

if (process.env.REDIS_CACHE_ENABLED === 'true' && process.env.REDIS_CACHE_URL && process.env.WAF_CACHE_URL) {
  redisClient = redis.createClient({ url: process.env.REDIS_CACHE_URL })

  redisClient.on('ready', () => {
    redisClientConnected = true

    const cache = apiCache.options({
      headers: {
        'cache-control': 'no-cache'
      },
      redisClient: redisClient
    }).middleware

    router.use('/content', cache('6 hours'), cmsEndpoints)
  })
} else {
  router.use('/content', cmsEndpoints)
}

router.use('/static', staticEndpoints)
router.use('/geocode', geocodingEndpoints)
router.use('/liveres', liveResEndpoints)

export default router
