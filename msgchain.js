const IPFS = require('ipfs');
const ipfs = new IPFS();
const ipfs_is_read=false;
var StromDAOBO = require("stromdao-businessobject");   
var request = require('then-request');

module.exports = {
	retrieve:function(hash,cb) {
		var _retr=function(ipfs_hash,cb) {			
			request('GET', 'https://fury.network/ipfs/'+ipfs_hash).done(function (res) {
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
	},
	retrieveIPFS:function(hash,cb) {
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
	},
	store:function(data,cb) {		
		var node = new StromDAOBO.Node({external_id:"msgchain",testMode:true,rpc:global.rpcprovider});		
		ipfs.files.add({path:'/storage',content:new ipfs.types.Buffer(data,'ascii')}, function (err, files) {
			var s=node.storage.getItemSync(files[0].hash);
			if((typeof s == "undefined")||(s==null)) {
				node.stringstoragefactory().then(function(ssf) {
					ssf.build(files[0].hash).then(function(tx) {
						node.storage.setItemSync(files[0].hash,tx);	
						msgchain.retrieve(tx,function(s) { 
							if((typeof cb != "undefined")&&(cb!=null)) cb(tx);
						});																
					});				
				});					
			} else {				
				if((typeof cb != "undefined")&&(cb!=null)) cb(s);
			}
		});		
	}
};
msgchain = module.exports;	
