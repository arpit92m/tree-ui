var MongoClient  = require('mongodb').MongoClient;
var Promise = require('bluebird');
var url = 'mongodb://mandloa:Skirn1234@ds127854.mlab.com:27854/traxcn';

module.exports = {
	connect:function(){
		return new Promise(function(resolve,reject){
			MongoClient.connect(url,function(err,db){
               if(err){
               	return reject(err);
               }
               return resolve(db);

				});
		});
	},
	close:function(db){
		db.close();
	}
};