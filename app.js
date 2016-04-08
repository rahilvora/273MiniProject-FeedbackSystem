/**
 * Module dependencies.
 */

var express = require('express'),
 	routes = require('./routes'),
 	user = require('./routes/user'),
 	http = require('http'), path = require('path'),
 	fs = require('fs');

var app = express();

var db;
var cloudant;
var dbname

var Cloudant = require('cloudant');

function connectToDatabase(){
	var username = '33839c20-a54c-43ec-a429-7b013fadba5f-bluemix'; // Set this to your own account
	var password = 'd27fd9946c754db6ea8fcedb182d3a8358203aa009db9fde6edc813ca66f27fd';
	// Initialize the library with my account.
	cloudant = Cloudant({account:username, password:password});

	cloudant.db.list(function(err, allDbs) {
		console.log('All my databases: %s', allDbs.join(', '))
	});
	dbname = cloudant.db.use('ratings');
}

connectToDatabase();

var fileToUpload;

var dbCredentials = {
	dbName : 'ratings'
};

var textToSpeech = {

};

var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var logger = require('morgan');
var errorHandler = require('errorhandler');
var multipart = require('connect-multiparty')
var multipartMiddleware = multipart();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);
app.use(logger('dev'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(methodOverride());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/style', express.static(path.join(__dirname, '/views/style')));

// development only
if ('development' == app.get('env')) {
	app.use(errorHandler());
}
//
//function initDBConnection() {
//	//console.log("Process data"+process.env);
//	//console.log("initDBConnection inside");
//	if(process.env.VCAP_SERVICES) {
//		console.log("inside if statement");
//
//		var vcapServices = JSON.parse(process.env.VCAP_SERVICES);
//		// Pattern match to find the first instance of a Cloudant service in
//		// VCAP_SERVICES. If you know your service key, you can access the
//		// service credentials directly by using the vcapServices object.
//		for(var vcapService in vcapServices){
//			if(vcapService.match(/cloudant/i)){
//				dbCredentials.host = vcapServices[vcapService][0].credentials.host;
//				dbCredentials.port = vcapServices[vcapService][0].credentials.port;
//				dbCredentials.user = vcapServices[vcapService][0].credentials.username;
//				dbCredentials.password = vcapServices[vcapService][0].credentials.password;
//				dbCredentials.url = vcapServices[vcapService][0].credentials.url;
//
//				cloudant = require('cloudant')(dbCredentials.url);
//
//				// check if DB exists if not create
//				cloudant.db.create(dbCredentials.dbName, function (err, res) {
//					if (err) {
//						console.log('could not create db ', err);
//					}
//
//				});
//
//				db = cloudant.use(dbCredentials.dbName);
//				break;
//			}
//		}
//		if(db==null){
//			console.warn('Could not find Cloudant credentials in VCAP_SERVICES environment variable - data will be unavailable to the UI');
//		}
//	} else{
//		console.warn('VCAP_SERVICES environment variable not set - data will be unavailable to the UI');
//		// For running this app locally you can get your Cloudant credentials
//		// from Bluemix (VCAP_SERVICES in "cf env" output or the Environment
//		// Variables section for an app in the Bluemix console dashboard).
//		// Alternately you could point to a local database here instead of a
//		// Bluemix service.
//		dbCredentials.host = "33839c20-a54c-43ec-a429-7b013fadba5f-bluemix.cloudant.com";
//		dbCredentials.port = 443;
//		dbCredentials.user = "33839c20-a54c-43ec-a429-7b013fadba5f-bluemix";
//		dbCredentials.password = "d27fd9946c754db6ea8fcedb182d3a8358203aa009db9fde6edc813ca66f27fd";
//		dbCredentials.url = "https://33839c20-a54c-43ec-a429-7b013fadba5f-bluemix:d27fd9946c754db6ea8fcedb182d3a8358203aa009db9fde6edc813ca66f27fd@33839c20-a54c-43ec-a429-7b013fadba5f-bluemix.cloudant.com";
//	}
//
//}
//
//initDBConnection();

(function(){
	textToSpeech.username = "992f1224-d4e0-4db8-8ee1-b74f6806fed1"
	textToSpeech.password = "y8nVjX99i7hu"
	textToSpeech.url = "https://stream.watsonplatform.net/text-to-speech/api"
})();

app.get('/', routes.index);
app.get('/rakesh', function(req,res) {
	var query ={
		"selector": {
			"professorValue":"Rakesh Ranjan",
			"_id": {
				"$gt": 0
			}
		},
		"fields": [
			"professorValue",
			"AssignmentValue",
			"ConceptValue",
			"TechnologyValue",
			"HelpfulnessValue"
		],
		"sort": [
			{
				"_id": "asc"
			}
		]
	};
	dbname.find(query,function(err,result){
		getSum(result,function(answer){
			console.log(answer);
			calculatePercentage(answer, function(finalAnswer){
				console.log(finalAnswer);
				//res.send(finalAnswer);
				res.render('ranjan.html',
					{
						Assignment:JSON.stringify(finalAnswer.AssignmentValue),
						Concept:JSON.stringify(finalAnswer.ConceptValue),
						Technology:JSON.stringify(finalAnswer.TechnologyValue),
						Helpfulness:JSON.stringify(finalAnswer.HelpfulnessValue)
					}
				);
			});
		});
	});
});
app.get('/paul', function(req,res) {
	var query ={
		"selector": {
			"professorValue":"N.Paul",
			"_id": {
				"$gt": 0
			}
		},
		"fields": [
			"professorValue",
			"AssignmentValue",
			"ConceptValue",
			"TechnologyValue",
			"HelpfulnessValue"
		],
		"sort": [
			{
				"_id": "asc"
			}
		]
	};
	dbname.find(query,function(err,result){
		getSum(result,function(answer){
			console.log(answer);
			calculatePercentage(answer, function(finalAnswer){
				console.log(finalAnswer);
				//res.send(finalAnswer);
				res.render('paul.html',
					{
						Assignment:JSON.stringify(finalAnswer.AssignmentValue),
						Concept:JSON.stringify(finalAnswer.ConceptValue),
						Technology:JSON.stringify(finalAnswer.TechnologyValue),
						Helpfulness:JSON.stringify(finalAnswer.HelpfulnessValue)
					}
				)
			});
		});
	});
});
app.get('/gao', function(req,res) {
	var query ={
		"selector": {
			"professorValue":"Jerry Gao",
			"_id": {
				"$gt": 0
			}
		},
		"fields": [
			"professorValue",
			"AssignmentValue",
			"ConceptValue",
			"TechnologyValue",
			"HelpfulnessValue"
		],
		"sort": [
			{
				"_id": "asc"
			}
		]
	};
	dbname.find(query,function(err,result){
		getSum(result,function(answer){
			console.log(answer);
			calculatePercentage(answer, function(finalAnswer){
				console.log(finalAnswer);
				//res.send(finalAnswer);
				res.render('gao.html',
					{
					Assignment:JSON.stringify(finalAnswer.AssignmentValue),
					Concept:JSON.stringify(finalAnswer.ConceptValue),
					Technology:JSON.stringify(finalAnswer.TechnologyValue),
					Helpfulness:JSON.stringify(finalAnswer.HelpfulnessValue)
					}
				);
			});
		});
	});
});

app.get('/fayad', function(req,res) {
	var query ={
		"selector": {
			"professorValue":"M. Fayad",
			"_id": {
				"$gt": 0
			}
		},
		"fields": [
			"professorValue",
			"AssignmentValue",
			"ConceptValue",
			"TechnologyValue",
			"HelpfulnessValue"
		],
		"sort": [
			{
				"_id": "asc"
			}
		]
	};

	dbname.find(query,function(err,result){
		getSum(result,function(answer){
			console.log(answer);
			calculatePercentage(answer, function(finalAnswer){
				console.log(finalAnswer);
				//res.send(finalAnswer);
				res.render('fayad.html',
					{
					Assignment:JSON.stringify(finalAnswer.AssignmentValue),
					Concept:JSON.stringify(finalAnswer.ConceptValue),
					Technology:JSON.stringify(finalAnswer.TechnologyValue),
					Helpfulness:JSON.stringify(finalAnswer.HelpfulnessValue)
					}
				);
			});
		});
	});

});

app.get('/shim', function(req,res) {
	var query ={
		"selector": {
			"professorValue":"Shim Simon",
			"_id": {
				"$gt": 0
			}
		},
		"fields": [
			"professorValue",
			"AssignmentValue",
			"ConceptValue",
			"TechnologyValue",
			"HelpfulnessValue"
		],
		"sort": [
			{
				"_id": "asc"
			}
		]
	};
	dbname.find(query,function(err,result){
		getSum(result,function(answer){
			console.log(answer);
			calculatePercentage(answer, function(finalAnswer){
				console.log(finalAnswer);
				//res.send(finalAnswer);
				res.render('shim.html',
					{
						Assignment:JSON.stringify(finalAnswer.AssignmentValue),
						Concept:JSON.stringify(finalAnswer.ConceptValue),
						Technology:JSON.stringify(finalAnswer.TechnologyValue),
						Helpfulness:JSON.stringify(finalAnswer.HelpfulnessValue)
					}
				);
			});
		});
	});
});

app.post('/submit', function(req, res){
	//var dbname = cloudant.db.use('ratings');
	dbname.insert(req.body,function(err,result){
		if(err){
			console.log(err);
		}
	});
	var answer = "Data submitted";
	res.send(answer.toString());
});
function calculatePercentage(answer, callback){
	var finalAnswer = {
		AssignmentValue:0,
		ConceptValue:0,
		TechnologyValue:0,
		HelpfulnessValue:0
	};
	finalAnswer.AssignmentValue = ((answer.AssignmentValue)/(5*answer.length))*100;
	finalAnswer.ConceptValue = ((answer.ConceptValue)/(5*answer.length))*100;
	finalAnswer.TechnologyValue = ((answer.TechnologyValue)/(5*answer.length))*100;
	finalAnswer.HelpfulnessValue = ((answer.HelpfulnessValue)/(5*answer.length))*100;
	//return finalAnswer;
	callback(finalAnswer);
}
function getSum(result,callback){
	var i = 0,
		length = result.docs.length,
		answer = {

		},
		AssignmentValue = 0,
		ConceptValue= 0,
		TechnologyValue = 0,
		HelpfulnessValue = 0;

	while(i<length){
		AssignmentValue += Number(result.docs[i].AssignmentValue);
		ConceptValue += Number(result.docs[i].ConceptValue);
		TechnologyValue += Number(result.docs[i].TechnologyValue);
		HelpfulnessValue += Number(result.docs[i].HelpfulnessValue);
		console.log(i+" : "+result.docs[i]);
		i++;
		if(i>=length){
			answer.AssignmentValue = AssignmentValue;
			answer.ConceptValue = ConceptValue;
			answer.TechnologyValue = TechnologyValue;
			answer.HelpfulnessValue = HelpfulnessValue;
			answer.length = length;
			//return answer;
			callback(answer);
			//break;
		}
	}
}
function createResponseData(id, name, value, attachments) {

	var responseData = {
		id : id,
		name : name,
		value : value,
		attachements : []
	};
	
	 
	attachments.forEach (function(item, index) {
		var attachmentData = {
			content_type : item.type,
			key : item.key,
			url : '/api/favorites/attach?id=' + id + '&key=' + item.key
		};
		responseData.attachements.push(attachmentData);
		
	});
	return responseData;
}


var saveDocument = function(id, name, value, response) {
	
	if(id === undefined) {
		// Generated random id
		id = '';
	}
	
	db.insert({
		name : name,
		value : value
	}, id, function(err, doc) {
		if(err) {
			console.log(err);
			response.sendStatus(500);
		} else
			response.sendStatus(200);
		response.end();
	});
	
}

app.get('/api/favorites/attach', function(request, response) {
    var doc = request.query.id;
    var key = request.query.key;

    db.attachment.get(doc, key, function(err, body) {
        if (err) {
            response.status(500);
            response.setHeader('Content-Type', 'text/plain');
            response.write('Error: ' + err);
            response.end();
            return;
        }

        response.status(200);
        response.setHeader("Content-Disposition", 'inline; filename="' + key + '"');
        response.write(body);
        response.end();
        return;
    });
});

app.post('/api/favorites/attach', multipartMiddleware, function(request, response) {

	console.log("Upload File Invoked..");
	console.log('Request: ' + JSON.stringify(request.headers));
	
	var id;
	
	db.get(request.query.id, function(err, existingdoc) {		
		
		var isExistingDoc = false;
		if (!existingdoc) {
			id = '-1';
		} else {
			id = existingdoc.id;
			isExistingDoc = true;
		}

		var name = request.query.name;
		var value = request.query.value;

		var file = request.files.file;
		var newPath = './public/uploads/' + file.name;		
		
		var insertAttachment = function(file, id, rev, name, value, response) {
			
			fs.readFile(file.path, function(err, data) {
				if (!err) {
				    
					if (file) {
						  
						db.attachment.insert(id, file.name, data, file.type, {rev: rev}, function(err, document) {
							if (!err) {
								console.log('Attachment saved successfully.. ');
	
								db.get(document.id, function(err, doc) {
									console.log('Attachements from server --> ' + JSON.stringify(doc._attachments));
										
									var attachements = [];
									var attachData;
									for(var attachment in doc._attachments) {
										if(attachment == value) {
											attachData = {"key": attachment, "type": file.type};
										} else {
											attachData = {"key": attachment, "type": doc._attachments[attachment]['content_type']};
										}
										attachements.push(attachData);
									}
									var responseData = createResponseData(
											id,
											name,
											value,
											attachements);
									console.log('Response after attachment: \n'+JSON.stringify(responseData));
									response.write(JSON.stringify(responseData));
									response.end();
									return;
								});
							} else {
								console.log(err);
							}
						});
					}
				}
			});
		}

		if (!isExistingDoc) {
			existingdoc = {
				name : name,
				value : value,
				create_date : new Date()
			};
			
			// save doc
			db.insert({
				name : name,
				value : value
			}, '', function(err, doc) {
				if(err) {
					console.log(err);
				} else {
					
					existingdoc = doc;
					console.log("New doc created ..");
					console.log(existingdoc);
					insertAttachment(file, existingdoc.id, existingdoc.rev, name, value, response);
					
				}
			});
			
		} else {
			console.log('Adding attachment to existing doc.');
			console.log(existingdoc);
			insertAttachment(file, existingdoc._id, existingdoc._rev, name, value, response);
		}
		
	});

});

app.post('/api/favorites', function(request, response) {

	console.log("Create Invoked..");
	console.log("Name: " + request.body.name);
	console.log("Value: " + request.body.value);
	
	// var id = request.body.id;
	var name = request.body.name;
	var value = request.body.value;
	
	saveDocument(null, name, value, response);

});

app.delete('/api/favorites', function(request, response) {

	console.log("Delete Invoked..");
	var id = request.query.id;
	// var rev = request.query.rev; // Rev can be fetched from request. if
	// needed, send the rev from client
	console.log("Removing document of ID: " + id);
	console.log('Request Query: '+JSON.stringify(request.query));
	
	db.get(id, { revs_info: true }, function(err, doc) {
		if (!err) {
			db.destroy(doc._id, doc._rev, function (err, res) {
			     // Handle response
				 if(err) {
					 console.log(err);
					 response.sendStatus(500);
				 } else {
					 response.sendStatus(200);
				 }
			});
		}
	});

});

app.put('/api/favorites', function(request, response) {

	console.log("Update Invoked..");
	
	var id = request.body.id;
	var name = request.body.name;
	var value = request.body.value;
	
	console.log("ID: " + id);
	
	db.get(id, { revs_info: true }, function(err, doc) {
		if (!err) {
			console.log(doc);
			doc.name = name;
			doc.value = value;
			db.insert(doc, doc.id, function(err, doc) {
				if(err) {
					console.log('Error inserting data\n'+err);
					return 500;
				}
				return 200;
			});
		}
	});
});

app.get('/api/favorites', function(request, response) {

	console.log("Get method invoked.. ")
	
	db = cloudant.use(dbCredentials.dbName);
	var docList = [];
	var i = 0;
	db.list(function(err, body) {
		if (!err) {
			var len = body.rows.length;
			console.log('total # of docs -> '+len);
			if(len == 0) {
				// push sample data
				// save doc
				var docName = 'sample_doc';
				var docDesc = 'A sample Document';
				db.insert({
					name : docName,
					value : 'A sample Document'
				}, '', function(err, doc) {
					if(err) {
						console.log(err);
					} else {
						
						console.log('Document : '+JSON.stringify(doc));
						var responseData = createResponseData(
							doc.id,
							docName,
							docDesc,
							[]);
						docList.push(responseData);
						response.write(JSON.stringify(docList));
						console.log(JSON.stringify(docList));
						console.log('ending response...');
						response.end();
					}
				});
			} else {

				body.rows.forEach(function(document) {
					
					db.get(document.id, { revs_info: true }, function(err, doc) {
						if (!err) {
							if(doc['_attachments']) {
							
								var attachments = [];
								for(var attribute in doc['_attachments']){
								
									if(doc['_attachments'][attribute] && doc['_attachments'][attribute]['content_type']) {
										attachments.push({"key": attribute, "type": doc['_attachments'][attribute]['content_type']});
									}
									console.log(attribute+": "+JSON.stringify(doc['_attachments'][attribute]));
								}
								var responseData = createResponseData(
										doc._id,
										doc.name,
										doc.value,
										attachments);
							
							} else {
								var responseData = createResponseData(
										doc._id,
										doc.name,
										doc.value,
										[]);
							}	
						
							docList.push(responseData);
							i++;
							if(i >= len) {
								response.write(JSON.stringify(docList));
								console.log('ending response...');
								response.end();
							}
						} else {
							console.log(err);
						}
					});
					
				});
			}
			
		} else {
			console.log(err);
		}
	});

});


http.createServer(app).listen(app.get('port'), '0.0.0.0', function() {
	console.log('Express server listening on port ' + app.get('port'));
});

