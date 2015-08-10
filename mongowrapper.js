var mongoose = require('mongoose');
var uriUtil = require('mongodb-uri');
var DB_NAME = 'mockdata';

var connectionString = process.env.MONGO_URI || 'mongodb://localhost/';
var mongodbUri = connectionString + DB_NAME;
var mongooseUri = uriUtil.formatMongoose(mongodbUri);
mongoose.connect(mongooseUri);

mongoose.connection.on('connected', function() {
	console.log('Connected to MongoDB database.');
});

mongoose.connection.on('error', function(err) {
	console.log('WARNING: MongoDB database is not live.');
});

process.on('SIGINT', function() {  
  mongoose.connection.close(function () { 
    process.exit(0); 
  }); 
}); 

var mockResponseSchema = new mongoose.Schema({
	_id: mongoose.Schema.ObjectId,
	requestMethod: String,
	requestUrl: String,
	requestHeaders: {},
	queryParams: {},
	requestPayload: {},
	mockResponse: {}
});

var Mock = mongoose.model('MockDataCollections', mockResponseSchema);
module.exports = {
	Mock: Mock,
	mongoose: mongoose,
	COLLECTION_NAME: "MockDataCollections"
};