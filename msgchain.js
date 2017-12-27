const IPFS = require('ipfs');
const ipfs = new IPFS();
const ipfs_is_read=false;
var StromDAOBO = require("stromdao-businessobject");   

module.exports = {

	
	store:function(data,cb) {		
		var node = new StromDAOBO.Node({external_id:"msgchain",testMode:true,rpc:global.rpcprovider});		
		ipfs.files.add({path:'/storage',content:new ipfs.types.Buffer(data,'ascii')}, function (err, files) {
			var s=node.storage.getItemSync(files[0].hash);
			if((typeof s == "undefined")||(s==null)) {
				node.stringstoragefactory().then(function(ssf) {
					ssf.build(files[0].hash).then(function(tx) {
						node.storage.setItemSync(files[0].hash,tx);						
						if((typeof cb != "undefined")&&(cb!=null)) cb(tx);
					});				
				});					
			} else {				
				if((typeof cb != "undefined")&&(cb!=null)) cb(s);
			}
		});		
	}
};
msgchain = module.exports;	
