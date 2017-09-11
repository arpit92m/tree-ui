'use strict';
//first we import our dependencies…
var express = require('express');
var database = require('./database');
var bodyParser = require('body-parser');
var MongoClient = require('mongodb').MongoClient;

var app = express();
var router = express.Router();

var port = process.env.API_PORT || 3001;


app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(function(req, res, next) {
 res.setHeader('Access-Control-Allow-Origin', '*');
 res.setHeader('Access-Control-Allow-Credentials', 'true');
 res.setHeader('Access-Control-Allow-Methods', 'GET,HEAD,OPTIONS,POST,PUT,DELETE');
 res.setHeader('Access-Control-Allow-Headers', 'Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers');

 res.setHeader('Cache-Control', 'no-cache');
 next();
});

app.post('/addNode',function(req,res){
	console.log(req.body.parent);
	console.log(req.body.child);

	database.connect().then(function(db){
        db.collection('tracxn').find({parent:req.body.parent.text}).toArray(function(error,response){
        	if(error){
           	res.send(error);
           }
           response.forEach((doc)=>{
             if(doc.text===req.body.child.text){
             	res.send("same name")
             	database.close(db);
             }
           })
           var newChild = req.body.child;
           newChild.id=req.body.parent.text+"_"+response.length
		db.collection('tracxn').insert(newChild,function(err,result){
           if(err){
           	res.send(err);
           }
           res.send(result)

		});
		database.close(db);
	 });
   });
});


app.post('/removeAllNodes',function(req,res){
	console.log('*.'+req.body.parentChain+'.*');
	database.connect().then(function(db){
		db.collection('tracxn').remove({ id: req.body.id },function(error,response){
		if(error){
           	res.send(error);
           }
		db.collection('tracxn').remove({ parentChain: { $regex: req.body.text} },function(err,result){
           if(err){
           	res.send(err);
           }
           res.send(result)
           database.close(db);
		});
	});
	});
});


app.get('/findAllNodes',function(req,res){
	console.log(req.query)
	database.connect().then(function(db){
		db.collection('tracxn').find(req.query).toArray(function(err,result){
           if(err){
           	res.send(err);
           }
           res.send(result)
           database.close(db);
		});
	});
});

app.post('/updateNodes',function(req,res){
	
	database.connect().then(function(db){
		db.collection('tracxn').updateOne({id:req.body.swapId[0]},{$set:{id:req.body.swapId[1]}},function(error,result){
           if(error){
           	res.send(error);
           }
           console.log(result)
        db.collection('tracxn').updateOne({id:req.body.swapId[1],text:req.body.text[1]},{$set:{id:req.body.swapId[0]}},function(err,response){
           if(err){
           	res.send(err);
           }
           res.send([result,response])
           database.close(db);
		});
    });
	});
});

app.post('/editNode',function(req,res){
	console.log("body",req.body)
	database.connect().then(function(db){
		db.collection('tracxn').updateOne({id:req.body.id},{$set:{text:req.body.text}},function(error,result){
           if(error){
           	res.send(error);
           }

       db.collection('tracxn').updateMany({parent:req.body.originalText},{$set:{parent:req.body.text}},function(errorAfterParentSwap,responseAfterParentSwap){
           if(errorAfterParentSwap){
           	res.send(errorAfterParentSwap);
           }
       db.collection('tracxn').find({parentChain:{$regex:req.body.originalText}}).toArray(function(err,response){
          if(err){
          	 console.log('hre')
           	res.send(err);
           }
          console.log(response)
         response.forEach(function(doc) {
         	 
         	doc.parentChain = doc.parentChain.replace(req.body.originalText,req.body.text)
         	 
          db.collection('tracxn').save(doc)
      })
       res.send(result);
           database.close(db);
		});

      })
       })
   });
});

app.listen(port, function() {
 console.log(`api running on port ${port}`);
});