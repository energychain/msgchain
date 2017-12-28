var StromDAOBO = require("stromdao-businessobject");   
var request = require('then-request');
const IPFS = require('ipfs');



module.exports = function() {
	 this.retrieve=function(hash,cb) {
		var _retr=function(ipfs_hash,cb) {			
			request('GET', 'https://fury.network/ipfs/'+ipfs_hash,{timeout:30000}).catch(function(e) {    if((typeof cb != "undefined")&&(cb!=null)) cb(null);  }).then(function (res) {
			  if((typeof cb != "undefined")&&(cb!=null)) cb(res.getBody().toString());
			});
		}
		if(hash.substr(0,2)=="0x") {
			var node = new StromDAOBO.Node({external_id:"msgchain",testMode:true,rpc:global.rpcprovider});		
			node.stringstorage(hash).then(function(ss) {
				ss.str().then(function(ipfs_hash) {
					_retr(ipfs_hash,cb);
				});
			});
		} else {		
			_retr(hash);
		}
	}
	this.retrieveIPFS=function(hash,cb) {
		var _retr=function(ipfs_hash,cb) {						
			 if((typeof cb != "undefined")&&(cb!=null)) cb(ipfs_hash);			
		}
		if(hash.substr(0,2)=="0x") {
			var node = new StromDAOBO.Node({external_id:"msgchain",testMode:true,rpc:global.rpcprovider});		
			node.stringstorage(hash).then(function(ss) {
				ss.str().then(function(ipfs_hash) {
					_retr(ipfs_hash,cb);
				});
			});
		} else {		
			_retr(hash);
		}
	}
	this.store=function(data,cb) {		
		var node = new StromDAOBO.Node({external_id:"msgchain",testMode:true,rpc:global.rpcprovider});		
		const ipfs = new IPFS();
		
		ipfs.on('ready', () => { 
			ipfs.files.add({path:'/storage',content:new ipfs.types.Buffer(data,'ascii')}, function (err, files) {
				var s=node.storage.getItemSync(files[0].hash);
				if((typeof s == "undefined")||(s==null)) {
					node.stringstoragefactory().then(function(ssf) {
						ssf.build(files[0].hash).then(function(tx) {
							node.storage.setItemSync(files[0].hash,tx);	
							new msgchain().retrieve(tx,function(s) { 
								if((typeof cb != "undefined")&&(cb!=null)) cb(tx);
							});																
						});				
					});					
				} else {				
					if((typeof cb != "undefined")&&(cb!=null)) cb(s);
				}
			});		
			ipfs.stop();
		})
		   
		
	}
	this.msg=function(data,previous,cb) {
			var message={};
			message.data=data;
			message.previous=previous;			
			this.store(JSON.stringify(message),function(tx) {
				cb(tx);				
			});
	}
	this.tail=function(hash,cb) {
			this.retrieve(hash,function(part) {				
				var message = JSON.parse(part);
				if((typeof message.previous != "undefined") && (message.previous!=null)) {
						new msgchain().tail(message.previous,function(npart) {
							cb(npart+message.data);
						});
				} else {
						cb(message.data);
				}
			});		
	}
};
msgchain = module.exports;	
