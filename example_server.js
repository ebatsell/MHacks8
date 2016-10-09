

var YQL = require('yql');
var fs = require('fs');

var express = require('express');
var app = express();
app.set('views', './views');
app.set('view engine', 'ejs');

app.get('/', function (req, res) {
  // res.send('Hello World!');
    var query = new YQL('select * from weather.forecast where (woeid = 2354842)');

  	var condition = new Object();	
	query.exec(function(err, data) {
	  var location = data.query.results.channel.location;
	  condition = data.query.results.channel.item.condition;
	  console.log(location);
	  console.log(condition);
	  console.log('The current weather in ' + location.city + ', ' + location.region + ' is ' + condition.temp + ' degrees.');
	  console.log(condition)
      res.render('pages/index', {title: "Evan's Home Page", temperature: condition.temp});
	});
	res.render('pages/index', {widgets: widgets});
});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});


