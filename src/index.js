
// define converter functions
const TRYTE_ALPHABET = '9ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const asciiToTrytes = (input) => {
    let trytes = '';
    for (let i = 0; i < input.length; i++) {
        var dec = input[i].charCodeAt(0);
        trytes += TRYTE_ALPHABET[dec % 27];
        trytes += TRYTE_ALPHABET[(dec - dec % 27) / 27];
    }
    return trytes;
};
const trytesToAscii = (trytes) => {
    let ascii = '';
    for (let i = 0; i < trytes.length; i += 2) {
        ascii += String.fromCharCode(TRYTE_ALPHABET.indexOf(trytes[i]) + TRYTE_ALPHABET.indexOf(trytes[i + 1]) * 27);
    }
    return ascii;
};

// create entry point
const provider = 'https://nodes.devnet.iota.org:443'

// set mode
const mode = "restricted" // public | private | restricted

// set global variables
var root
var sideKey
var active = false

// initialize Mam object and prepare set mode
let state = Mam.init(provider)
const setMode = () => {
    if (mode == 'private') {
    Mam.changeMode(state, 'private')
    } else if (mode == 'restricted') {
        Mam.changeMode(state, 'restricted', sideKey)
    }}

// start fetching loop
function startLoop() {
    root = document.getElementById("root").value;
    let sideKeyascii = document.getElementById("sideKey").value;
    sideKey = asciiToTrytes(sideKeyascii);
    while (sideKey.length % 81 !== 0) {
        sideKey += '9';
    };
    document.getElementById("show").innerHTML += "<p>Fetching sensor data from the tangle...</p>";
    setMode();
    setInterval(async () => {
    if (active) return
    active = true
    await receiveMessage(root)
    active = false
}, 5000)
}


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
        alert(e)
    }
}

// logger function and convert trytes to ascii
function logger(data) {
    const json = JSON.parse(trytesToAscii(data))
    document.getElementById("show").innerHTML += "<p>" + json + "</p>";
}