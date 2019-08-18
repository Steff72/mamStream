// import library and create entry point
const Mam = require('@iota/mam')
const Converter = require('@iota/converter')
const provider = 'https://nodes.devnet.iota.org:443'

// set mode
const mode = "restricted" // public | private | restricted

// const root = 'ZEADOH9AE9OMMXQXSSOQXGTGOJSDOC9WJNHGWWSYXUDA9HSQLBPZCVURSHTCVRWLCINXBWMWBF9DJBNHC'
// const sideKey = 'secretkey'

// initialize Mam object
let state = Mam.init(provider)

// prepare promt
var readline = require('readline')
var rl = readline.createInterface(process.stdin, process.stdout)
var root
var sideKey
var active = false

// promt for sideKey adn set mode
rl.question('Enter the sidekey: ', (answer) => {
    sideKey = Converter.asciiToTrytes(answer);
    while(sideKey.length % 81 !== 0){
    sideKey += '9';
    }

    if (mode == 'private') {
        Mam.changeMode(state, 'private')
    } else if (mode == 'restricted') {
        Mam.changeMode(state, 'restricted', sideKey)
    }

    // promt for root and start receive Mam
    rl.question('Enter root: ', (answer) => {
        root = answer;
        
        // start fetching loop
        setInterval(async () => {
            if (active) return
            active = true
            await receiveMessage(root)
            active = false
        }, 5000)
        
    })
})

// fn to read message stream and return the key 'messages'
// Mam.fetch(root, mode, sideKey, callback)
// sidekey optional for 'restricted' mode
// callback function called with the return value when data has been retrieved.
const receiveMessage = async data => {
    try {
        let resp = await Mam.fetchSingle(data, mode, sideKey)
        root = resp.nextRoot
        logger(resp.payload)
    }   
    catch (e) {
        // console.log(e)
    }
}
    
// logger function and convert trytes to ascii
function logger(data) {
    const json = JSON.parse(Converter.trytesToAscii(data))
    console.log(json)
 }