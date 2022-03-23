const AWS = require('aws-sdk')
const mqtt = require('mqtt')
const SigV4Utils = require('./sigV4Utils');

AWS.config.region = 'eu-west-1'
AWS.config.credentials = new AWS.Credentials(process.env.AWS_ID, process.env.AWS_KEY)

let url = SigV4Utils.getSignedUrl(process.env.IOT_ENDPOINT, AWS.config.region, AWS.config.credentials);
const client = mqtt.connect(url);

client.on('error', (err) => {
  console.log('MQTT error', err);
})
client.on('close', () => {
  console.log('MQTT connection closed')
})
client.on('offline', () => {
  console.log('MQTT connection offline')
})

module.exports = function mqttProvider () {
  return {
    onReset: (cb) => {
      client.on('connect', () => {
        client.subscribe(process.env.CACHE_TOPIC)
        client.on('message', cb)
      })
    },
    requestCacheReset: () => {
      return new Promise((resolve, reject)=>{
        client.publish(process.env.CACHE_TOPIC, 'cache reset request', null, function(err){
          if (err){
            console.log('error clearing cache', err);
            return reject(err);
          }
          return resolve(this);
        });
      })
    }
  }
}
