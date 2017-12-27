#!/usr/bin/env node

const vorpal = require('vorpal')();
const fs = require('fs');
require('dotenv').config();
const msgchain=require("./msgchain.js");

vorpal
  .command('store <file>')    
  .description("Stores file and returns Energy Chain address")  
  .action(function (args,callback) {
		var content = fs.readFileSync(args.file, 'utf8').toString();		
		msgchain.store(content,function(str) {
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
