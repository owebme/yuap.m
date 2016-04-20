var config 			= require('./libs/config');
var express 		= require('express');
var favicon 		= require('serve-favicon');
var logger 			= require('morgan');
var methodOverride 	= require('method-override');
var session			= require('express-session');
var bodyParser 		= require('body-parser');
var path            = require('path');
var log             = require('./libs/log')(module);
var async 			= require('async');
var mongoose 		= require('mongoose');
var ObjectId		= require('mongodb').ObjectID;
//var generate 		= require('./generate');
var app = express();

app.set('port', process.env.PORT || config.get('port'));
app.use(favicon(__dirname + '/favicon.ico'));
app.use(logger('dev'));
app.use(methodOverride());
app.use(session({ resave: true, saveUninitialized: true, 
				  secret: 'uwotm8' }));
app.use(bodyParser.json());                        
app.use(bodyParser.urlencoded({ extended: true }));

var allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', 'http://192.168.1.68:3000');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
	
    if ('OPTIONS' == req.method) {
      res.send(200);
    }
    else {
      next();
    }
};
app.use(allowCrossDomain);

app.use(express.static(path.join(__dirname, '/')));

mongoose.connect(config.get('mongodb:uri'));

var db = mongoose.connection;

db.on('error', function (err) {
	log.error('Connection error:', err.message);
});

db.once('open', function callback () {
	log.info("Connected to DB!");
});

app.listen(config.get('port'), function(){
	log.info('Express server listening on port ' + config.get('port'));
});

app.get('/api/data/list/init/:sid', function(req, res) {
	async.parallel([
		function(callback){
			db.collection('data').find({"sid": req.params.sid}).sort({"date": -1}).limit(20).toArray(function(err, data){
				if (!data) {
					res.statusCode = 404;
					return res.send({error: 'Not found'});
				}
				if (!err) {
					callback(err, data);
				}
				else {
					res.statusCode = 500;
					log.error('Internal error(%d): %s', res.statusCode, err.message);
					return res.send({error: 'Server error'});
				}
			});		
		},
		function(callback){
			db.collection('status').find({"sid": req.params.sid}).toArray(function(err, data){
				if (!data) {
					res.statusCode = 404;
					return res.send({error: 'Not found'});
				}
				if (!err) {
					callback(err, data);
				}
				else {
					res.statusCode = 500;
					log.error('Internal error(%d): %s', res.statusCode, err.message);
					return res.send({error: 'Server error'});
				}
			});			
		},
	], function(err, results){
		return res.send({status: 'OK', result: {
			list: results[0],
			status: results[1]
		}});
	});

});

app.put('/api/data/list/viewed/:sid', function(req, res) {

	if (!req.body.length) return;

	req.body.forEach(function(item){
		db.collection('data').update(
		{
			"_id": ObjectId(item),
			"sid": req.params.sid
		},
		{
			$set: {
				"new": false
			}
		});
	});
});

app.put('/api/data/list/important/:sid', function(req, res) {

	if (!req.body.length) return;

	req.body.forEach(function(item){
		db.collection('data').update(
		{
			"_id": ObjectId(item),
			"sid": req.params.sid
		},
		{
			$set: {
				"important": true
			}
		});
	});
});

app.put('/api/data/list/unimportant/:sid', function(req, res) {

	if (!req.body.length) return;

	req.body.forEach(function(item){
		db.collection('data').update(
		{
			"_id": ObjectId(item),
			"sid": req.params.sid
		},
		{
			$set: {
				"important": false
			}
		});
	});
});

app.get('/api', function (req, res) {
	res.send('API is running');
});

// app.use(function(req, res, next){
    // res.status(404);
    // log.debug('Not found URL: %s',req.url);
    // res.send({ error: 'Not found' });
    // return;
// });

// app.use(function(err, req, res, next){
    // res.status(err.status || 500);
    // log.error('Internal error(%d): %s', res.statusCode, err.message);
    // res.send({ error: err.message });
    // return;
// });

function $fetch(query, res, callback){
	query.toArray(function(err, data){
		errHandler(res, err, data, function(data){
			if (callback) callback(data);
		});
	});
};

function errHandler(res, err, data, callback){
	if (!data) {
		res.statusCode = 404;
		return res.send({error: 'Not found'});
	}
	if (!err) {
		callback(res.send({status: 'OK', result: data}));
	}
	else {
		res.statusCode = 500;
		log.error('Internal error(%d): %s', res.statusCode, err.message);
		return res.send({error: 'Server error'});
	}
}

// db.collection('data').aggregate([
// {
	// $match : {
	   // sid : String(req.params.sid)
	// }				
// },
// {
	// $project : {
		// type: 1,
		// image: 1,
		// title: 1,
		// text: 1,
		// new: 1,
		// important: 1,
		// status: 1,
		// date : { $dateToString: { format: "%Y-%m-%d", date: "$date" } },
		// time : { $dateToString: { format: "%H:%M", date: "$date" } }
	// }
// },
// {
	// $sort : { date: -1 }
// },
// {
	// $limit : 20
// }			
// ]).toArray(function(err, data){