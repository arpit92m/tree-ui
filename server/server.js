'use strict';
//first we import our dependencies…
var express = require('express');
var database = require('./database');
var bodyParser = require('body-parser');
var MongoClient = require('mongodb').MongoClient;
var path = require('path');

var app = express();
var router = express.Router();

app.set('port', (process.env.PORT || 5000));


app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use('/', express.static(path.join(__dirname, '../build')))

app.use(function(req, res, next) {
 res.setHeader('Access-Control-Allow-Origin', '*');
 res.setHeader('Access-Control-Allow-Credentials', 'true');
 res.setHeader('Access-Control-Allow-Methods', 'GET,HEAD,OPTIONS,POST,PUT,DELETE');
 res.setHeader('Access-Control-Allow-Headers', 'Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers');

 res.setHeader('Cache-Control', 'no-cache');
 next();
});

app.post('/addNode',function(req,res){
  var flagForSameName = false;
  console.log(req.body.parent);
	database.connect().then(function(db){
        db.collection('tracxn').find({parent:req.body.parent.text}).toArray(function(error,response){
        	if(error){
           	res.send(error);
           }
           console.log(response);
           response.forEach((doc)=>{

             if(doc.text===req.body.child.text){

             	flagForSameName=true;
             	database.close(db);
             }
           })
           if(flagForSameName) {
            res.send("same name")
           }
           else{
           var newChild = req.body.child;
           newChild.id=req.body.parent.text+"_"+response.length
		db.collection('tracxn').insert(newChild,function(err,result){
           if(err){
           	res.send(err);
           }
           res.send(result)


		});
		database.close(db);
  }
	 });
   });
});


app.post('/removeAllNodes',function(req,res){
	console.log('*.'+req.body.parentText+'.*');
  var indexDeletion = req.body.id.split("_")[1]
	database.connect().then(function(db){
		db.collection('tracxn').remove({ id: req.body.id },function(error,response1){
		if(error){
           	res.send(error);
           }
		db.collection('tracxn').remove({ parentChain: { $regex: req.body.text} },function(err,result){
           if(err){
           	res.send(err);
           }
    db.collection('tracxn').find({parent:req.body.parentText}).toArray(function(err,response){
          if(err){
       
            res.send(err);
           }
         response.forEach(function(doc) {
          if(doc.id.split("_")[1]>indexDeletion) {
          console.log(doc.id)
          doc.id = doc.id.replace(doc.id.split("_")[1],(doc.id.split("_")[1]*1-1).toString())
          console.log(doc.id)
           db.collection('tracxn').save(doc)
        }
           
         
      })
              res.send("deleted");
           database.close(db);
         });
        
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
           console.log("reeeeee",result.data)

       db.collection('tracxn').updateMany({parent:req.body.originalText},{$set:{parent:req.body.text}},function(errorAfterParentSwap,responseAfterParentSwap){
           if(errorAfterParentSwap){
           	res.send(errorAfterParentSwap);
           }

       db.collection('tracxn').find({parent:req.body.originalText}).toArray(function(err,responseForIdSwap){
          if(err){
            res.send(err);
           }
           console.log("r,responseForIdSwap",responseForIdSwap)
         responseForIdSwap.forEach(function(doc) {
           console.log(doc.id)
          doc.id = doc.id.replace(req.body.originalText,req.body.text)
           console.log(doc.id)
          db.collection('tracxn').save(doc)
      })
  
       db.collection('tracxn').find({parentChain:{$regex:req.body.originalText}}).toArray(function(err,response){
          if(err){
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
});
      })
       })
   });
});

app.get('/', function(request, response) {
    var result = 'App is running'
    response.send(result);
}).listen(app.get('port'), function() {
    console.log('App is running, server is listening on port ', app.get('port'));
});