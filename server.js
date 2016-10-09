

var YQL = require('yql');
var fs = require('fs');

var options = {
    key: fs.readFileSync('node_modules/rtcmulticonnection-v3/fake-keys/privatekey.pem'),
    cert: fs.readFileSync('node_modules/rtcmulticonnection-v3/fake-keys/certificate.pem')
};

var express = require('express');
var http = require('https');
var app = express();
var server = http.createServer(options, app);
var rtc = require('./node_modules/rtcmulticonnection-v3/Signaling-Server.js')(server)

app.set('views', './views');
app.set('view engine', 'ejs');

require('./node_modules/rtcmulticonnection-v3/RTCMultiConnection.js')
var connection = new RTCMultiConnection();
app.get('/', function (req, res) {
 //  // res.send('Hello World!');
 //    var query = new YQL('select * from weather.forecast where (woeid = 2354842)');

 //  	var condition = new Object();	
	// query.exec(function(err, data) {
	//   var location = data.query.results.channel.location;
	//   condition = data.query.results.channel.item.condition;
	//   console.log(location);
	//   console.log(condition);
	//   console.log('The current weather in ' + location.city + ', ' + location.region + ' is ' + condition.temp + ' degrees.');
	//   console.log(condition)
 //      res.render('pages/index', {title: "Evan's Home Page", temperature: condition.temp});
	// });
	res.render('pages/index', {widgets: widgets});
});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});


