var fs = require('fs');
var readline = require('readline');
var google = require('googleapis');
var googleAuth = require('google-auth-library');

// If modifying these scopes, delete your previously>
var SCOPES = ['https://www.googleapis.com/auth/gmail.readonly'];

var TOKEN_DIR = (process.env.HOME || process.env.HOMEPATH ||
    process.env.USERPROFILE) + '/.credentials/';
var TOKEN_PATH = TOKEN_DIR + 'gmailToken.json';

var outputString = '';

// Load client secrets from a local file.
fs.readFile('client_secret.json', function processClientSecrets(err, content) {
  if (err) {
    console.log('Error loading client secret file: ' + err);
    return;
  }
  // Authorize a client with the loaded credentials, then call the
  // Google Mail API.
  authorize(JSON.parse(content), listMessages);
});

/**
 * Create an OAuth2 client with the given credentials, and then execute the
 * given callback function.
 *
 * @param {Object} credentials The authorization client credentials.
 * @param {function} callback The callback to call with the authorized client.
 */
function authorize(credentials, callback) {
  var clientSecret = credentials.installed.client_secret;
  var clientId = credentials.installed.client_id;
  var redirectUrl = credentials.installed.redirect_uris[0];
  var auth = new googleAuth();
  var oauth2Client = new auth.OAuth2(clientId, clientSecret, redirectUrl);

  // Check if we have previously stored a token.
  fs.readFile(TOKEN_PATH, function(err, token) {
    if (err) {
      getNewToken(oauth2Client, callback);
    } else {
      oauth2Client.credentials = JSON.parse(token);
      callback(oauth2Client);
    }
  });
}

/**
 * Get and store new token after prompting for user authorization, and then
 * execute the given callback with the authorized OAuth2 client.
 *
 * @param {google.auth.OAuth2} oauth2Client The OAuth2 client to get token for.
 * @param {getEventsCallback} callback The callback to call with the authorized
 *     client.
 */
function getNewToken(oauth2Client, callback) {
  var authUrl = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES
  });
  console.log('Authorize this app by visiting this url: ', authUrl);
  var rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  rl.question('Enter the code from that page here: ', function(code) {
    rl.close();
    oauth2Client.getToken(code, function(err, token) {
      if (err) {
        console.log('Error while trying to retrieve access token', err);
        return;
      }
      oauth2Client.credentials = token;
      storeToken(token);
      callback(oauth2Client);
    });
  });
}

/**
 * Store token to disk be used in later program executions.
 *
 * @param {Object} token The token to store to disk.
 */
function storeToken(token) {
  try {
    fs.mkdirSync(TOKEN_DIR);
  } catch (err) {
    if (err.code != 'EEXIST') {
      throw err;
    }
  }
  fs.writeFile(TOKEN_PATH, JSON.stringify(token));
  console.log('Token stored to ' + TOKEN_PATH);
}

function listMessages(auth) {
  var numMessages = 5;
  //defines a reference to the gmail API version 1
  var gmail = google.gmail('v1');

  //Sends a request to gmail/users/messages/list
  gmail.users.messages.list({
    auth: auth,
    userId: 'me',
    maxResults: numMessages,
    labelIds: ['UNREAD']
  }, function(err, response) {
    //Handles errors for the callback
    if(err) {
      console.log('The API returned an error: ' + err);
      return;
    }

    //Extracts the list of messages from the response
    var messages = response.messages;

    //Checks if the inbox is empty
    if(response.resultSizeEstimate === 0) {
      return 'No new Emails';
    }

    //Using the email id of each message extracts the message and outputs
    for(var i = 0; i < messages.length; i++) {
      gmail.users.messages.get({
        auth: auth,
        id: messages[i].id,
        userId: 'me',
        format: 'full'
      }, function(err, response) {
        if(err) {
          console.log('The API returned an error: ' + err);
          return;
        }

        var subject = 'subject';
        var date = 'date';
        var sender = 'sender';

        for(var i = 0; i < response.payload.headers.length; i++) {
          switch(response.payload.headers[i].name) {
            case 'Subject':
              subject = response.payload.headers[i].value;
              var split = subject.split(' <');
              subject = split[0];
              break;
            case 'Date':
              date = response.payload.headers[i].value;
              break;
            case 'From':
              sender = response.payload.headers[i].value;
              var split = sender.split(' <');
              sender = split[0];
              break;
          }
        }
        outputString += "From: " + sender + '\n' + subject + '\n' +
                        parseDateTime(date) + '\n';
      });
      return outputString;
    }
  });
}

function parseDateTime(dateTime) {
  var split = dateTime.split(' ');
  var date = parseDate([parseInt(split[3]), monthToNum(split[2]),
                        parseInt(split[1])]);

  var time = parseTime(split[4]);

  return date + " at " + time;
}

function parseTime(time) {
  var split = time.split(':');
  return split[0] + ":" + split[1];
}

//If the date is today returns today, if the date is not for today it returns
//the date as month/day
function parseDate(date) {
  var curDate = new Date();

  //Checks if the day is the same. If it is and the month and date are the same
  //it is today
  if(date[2] === curDate.getDate()) {
    if(date[0] === curDate.getFullYear() && date[1] ===
    curDate.getMonth() + 1) {
      return "Today";
    }
  }
  return date[1] + "/" + date[2];
}

function monthToNum(month) {
  switch(month) {
    case 'Jan':
      return 1;
    case 'Feb':
      return 2;
    case 'Mar':
      return 3;
    case 'Apr':
      return 4;
    case 'May':
      return 5;
    case 'Jun':
      return 6;
    case 'Jul':
      return 7;
    case 'Aug':
      return 8;
    case 'Sep':
      return 9;
    case 'Oct':
      return 10;
    case 'Nov':
      return 11;
    case 'Dec':
      return 12;
  }
}
