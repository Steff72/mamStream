// import Mmam client library
const Mam = require('@iota/mam')

// import converter module
const Converter = require('@iota/converter')

// import sensor module
const sensor = require('node-dht-sensor')

// set raspi gpio pin
const GPIOPIN = 4

// set sensortype to DHT11
const SENSORTYPE = 11

// define entry point into tangle
const provider = 'https://nodes.devnet.iota.org:443'

// public | private | restriced
const mode = 'restricted'

// sidekey for restricted mode. Must be 81 char long
// if shorter, fill up to 81 with '9'...
var sideKey = Converter.asciiToTrytes('secretkey');
while(sideKey.length % 81 !== 0){
sideKey += '9';
}

// initialize Mam object
// The call to Mam.init() generates a random seed and returns 
// a state object that we can use to control and track the message stream
let state = Mam.init(provider)
// console.log(state)

// default mode is public. change mode if not...
if (mode == 'private') {
    Mam.changeMode(state, 'private')
 } else if (mode == 'restricted') {
    Mam.changeMode(state, 'restricted', sideKey)
 }

// convert data in packet to Trytes.
// create message object and replace old state with returned new state
// send message to the tangle. pass payload and reception address
const publish = async function(packet) {
    const trytes = Converter.asciiToTrytes(JSON.stringify(packet))
 
    const message = Mam.create(state, trytes)
    state = message.state
    // console.log(state)
 
    await Mam.attach(message.payload, message.address)
    console.log(message.root)
    return message.root
 }

// function to generate random json sensor data
var DATA
const sensorData = () => {
    sensor.read(SENSORTYPE, GPIOPIN, async function(err, temperature, humidity) {
        if (!err) {
           DATA = `{temp: ${temperature.toFixed(1)} C, humidity: ${humidity.toFixed(1)} %}`
        } else {
            console.log(err);
        }
    })    
    return JSON.stringify({ time: new Date().toUTCString(), data: DATA })
 }

// publish data every 10 seconds
setInterval(() => {
    publish(sensorData())
 }, 10000)