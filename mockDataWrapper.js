var mongo = require('./mongowrapper');
var mongoose = require('mongoose');

module.exports = {
	// built to manually add in new entries to database
	createNewMockEntry: function(requestMethod, requestUrl, requestHeaders, queryParams, requestPayload, mockResponse) {
		var mockdata = new mongo.Mock();
		mockdata._id = mongoose.Types.ObjectId();
		mockdata.requestMethod = requestMethod;
		mockdata.requestUrl = requestUrl;
		mockdata.requestHeaders = requestHeaders;
		mockdata.queryParams = queryParams;
		mockdata.requestPayload = requestPayload || {};
		mockdata.mockResponse = mockResponse;
		mockdata.save();
	},
	
	findMockEntryByRequestData: function(method, url, headers, qp, payload, callback) {
		var query = {
			requestMethod: method,
			requestUrl: url,
		};
		if (Object.keys(payload).length !== 0) {
			query.requestPayload = payload;
		}
		if (Object.keys(qp).length !== 0) {
			query.queryParams = qp;
		}
		mongo.Mock.find(query, function(err, entries) {
			var selected;
			if (entries) {
				for (var i = 0; i < entries.length; i++) {
					var entry = entries[i];
					var acceptable = false;
					for (var header in entry.requestHeaders) {
						if (headers[header] && entry.requestHeaders[header] === headers[header]) {
							acceptable = true;
						}
					}
					if (acceptable || !entry.requestHeaders) {
						selected = entry;
						break;
					}
				}
				callback(err, selected);
			} else {
				callback(err);
			}
		});
	},

	dropDatabase: function(callback) {
		mongoose.connection.collections[mongo.COLLECTION_NAME.toLowerCase()].drop(function(err) {
			console.log('collection dropped');
			callback();
		});
	}
};