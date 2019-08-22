# mamStream
CS50 final project - IOTA Mam Stream

IOTA is a distributed ledger technology using a directed acyclic graph, called Tangle, instead of a blockchain.
Read more about it on iota.org.

Masked Authenticated Messaging, MAM, is is a second layer data communication protocol which adds functionality to emit and access an encrypted data stream, like RSS, over the Tangle.

The MAM library is written for Javascript, therefore I'm using Node JS to implement my project.

Sender.js is running on a Raspberry Pi 3+, sending temperature and humidity readings from a DHT11 sensor to the IOTA tangle using Masked Authenticated Messaging. The root to receive the datastream is logged to the console.

Index.html provides a receiver in the browser, where the root and the encryption key can be entered to start receiving the data stream.

Receiver.js can be used to run the receiver in a Node JS enviroment instead of the browser.

You can check out the project here:
https://steff72.github.io/mamStream/index.html

using a root from August 22nd 2019:
IDGKIGOGXBQNEQAQQ9NBOXGNRKPZVZ9CBUVYRXAVFNYJNDHLTJXBHDWSWXUXDHFBAGHFXTXALCRFATQLV

and sidekey:
secretkey

Cheers:)