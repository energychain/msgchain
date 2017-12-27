# msgchain
Module to build a chain of messages to be committed to energy blockchain.

## Installation
```
npm install -g msgchain
```

## Usage Commandline
```
stromdao.msgchain help
```

## Usage in Node JS
```
const MSGChain=require("msgchain");
var msgchain=new MSGChain();

msgchain.store("Some Data",function(tx) {console.log("Energy Chain Address",tx)});
```
