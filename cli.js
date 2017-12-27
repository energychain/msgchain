#!/usr/bin/env node

const vorpal = require('vorpal')();
const fs = require('fs');
require('dotenv').config();
const MSGChain=require("./msgchain.js");
var msgchain=new MSGChain();

vorpal
  .command('store <file>')    
  .description("Stores file and returns Energy Chain address")  
  .action(function (args,callback) {
		var content = fs.readFileSync(args.file, 'utf8').toString();		
		msgchain.store(content,function(str) {
			vorpal.log(str);callback();
		});		
	});

vorpal
  .command('retrieve')    
  .description("Resolves Energy Chain address and retrieves content from IPFS") 
  .option('-a, --address <energy_chain>', 'Energy Chain Address')
  .types({
    string: ['a', 'string']
  }) 
  .action(function (args,callback) {		
		msgchain.retrieve(args.options.address,function(str) {
			vorpal.log(str);callback();
		});		
	});

vorpal
  .command('retrieveIPFS')    
  .description("Resolves Energy Chain address and retrieves IPFS hash") 
  .option('-a, --address <energy_chain>', 'Energy Chain Address')
  .types({
    string: ['a', 'string']
  }) 
  .action(function (args,callback) {		
		msgchain.retrieveIPFS(args.options.address,function(str) {
			vorpal.log(str);callback();
		});		
});
		
if(typeof process.env.rpcprovider !="undefined") {	
		global.rpcprovider=process.env.rpcprovider;
} else {
		global.rpcprovider="https://fury.network/rpc";
}

if(typeof process.env.rpcprovider !="undefined") {	
		global.rpcprovider=process.env.rpcprovider;
} else {
		global.rpcprovider="https://fury.network/rpc";
}
var cli = new require("stromdao-cli-helper")(vorpal);
