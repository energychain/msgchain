/**
  MSG Chain Main Test
*/

var assert = require('assert');
const MSGchain=require("../msgchain.js");
var msgchain=new MSGchain();


describe('Energy Chain MSG Loader', function() {
	var msg1 = Math.random()*10000000; 
	var msg1_address=null;
	var msg2 = Math.random()*10000000;
	var msg2_address=null;
	this.timeout(300000);	
	
    it('First message', function(done) {
		msgchain.store(JSON.stringify({msg1:msg1}),null,function(tx) {
			console.log("Energy Chain Address Msg 1:",tx);
			msg1_address=tx;
			done();
		});
	});	
	it('Append second message', function(done) {
		msgchain.store(JSON.stringify({msg2:msg2}),msg2,function(tx) {
			console.log("Energy Chain Address Msg 2",tx);
			msg2_address=tx;
			done();
		});
	});		
});
