var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');
var mockDataDb = require('./mockDataWrapper');

var app = express();
var router = express.Router();

router.get('/*', function(req, res) {
    getResponseFromDbOfType('GET', req, res);
});

router.post('/*', function(req, res) {
	getResponseFromDbOfType('GET', req, res);
});

var getResponseFromDbOfType = function(type, req, res) {
    var standardisedType = type.toUpperCase();
    mockDataDb.findMockEntryByRequestData(standardisedType, req.url.split('?')[0], req.headers, req.query, req.body, function(err, entry) {
		if (err) {
			res.status(500).send('Cannot connect to mock database');
		} else {
			if (entry) {
				res.send(entry.mockResponse);
			} else {
				res.sendStatus(404);
			}
		}
	});
};

app.engine('.html', require('ejs').__express);
app.set('view engine', 'html');
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json({
	limit: '1mb'
}));
app.use(bodyParser.urlencoded({
	extended: false,
	limit: '1mb'
}));
app.use(router);

app.set('port', process.env.PORT || 9009);

var clientServer = app.listen(app.get('port'), function() {
	console.log('Express server listening on port %d', clientServer.address().port);
});