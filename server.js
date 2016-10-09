var YQL = require('yql');
var express = require('express');
var app = express();

app.set('views', './views');
app.set('view engine', 'ejs');

app.use(express.static('views/pages'));

function defaultWidget() {1
	this.selected = false;
	this.location = -1;
	this.content = "";
}

var widgets = {
	"Calendar" : new defaultWidget(),
	"Mail" : new defaultWidget(),
	"Weather" : new defaultWidget(),
	"Clock" : new defaultWidget(),
	"api4" : new defaultWidget(),
	"api5" : new defaultWidget(),
	"api6" : new defaultWidget(),
	"api7" : new defaultWidget(),
	"api8" : new defaultWidget(),
	"api9" : new defaultWidget(),
	"api10" : new defaultWidget(),
	"api11" : new defaultWidget(),
	"api12" : new defaultWidget(),
	"api13" : new defaultWidget(),
	"api14" : new defaultWidget(),
	"api15" : new defaultWidget()
}

//parse selected widgets, hard-coded for now
var selections = {"Calendar" : 7, "Mail" : 1, "Weather" : 0, "Clock" : 3, "api4" :15, "api5" : 14}
for (key in selections) {
	widgets[key].selected = true;
	widgets[key].position = selections[key];
}

//example of including a custom api
//require('./api_modules/calendarWidget');

widgets["Calendar"].selected = true;
widgets["Clock"].selected = true;

if (widgets["Calendar"].selected) {

	widgets["Calendar"].content = "THE WEATHER IN ANN ARBOR IS 100";	
}
if (widgets["Mail"].selected) {

	widgets["Mail"].content = "666 EMAILS SATAN AKA HILLARY CLINTON";	
}
if (widgets["Weather"].selected) {

	widgets["Weather"].content = "YOU HAVE 0 EVENTS TODAY LOSER";	
}
if (widgets["Clock"].selected) {

	widgets["Clock"].content = "04:20";	
}
if (widgets["api4"].selected) {

	widgets["api4"].content = "";	
}
if (widgets["api5"].selected) {

	widgets["api5"].content = "";	
}


app.get('/', function (req, res) {
	res.render('pages/index', {widgets: widgets});
});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});


