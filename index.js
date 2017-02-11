var express = require('express');
var bodyParser = require('body-parser');
var request = require('request');
var app = express();

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.listen((process.env.PORT || 3000));

// Server frontpage
app.get('/', function (req, res) {
    res.send('This is SherlockBot Server');
});

// Facebook Webhook
app.get('/webhook', function (req, res) {
    if (req.query['hub.verify_token'] === 'testbot_verify_token') {
        res.send(req.query['hub.challenge']);
    } else {
        res.send('Invalid verify token');
    }
});

// handler receiving messages
app.post('/webhook', function (req, res) {
    var events = req.body.entry[0].messaging;
    for (i = 0; i < events.length; i++) {
        var event = events[i];
        if (event.message && event.message.text) {
            sendMessage(event.sender.id, {text: "Echo: " + event.message.text});
        }
    }
    res.sendStatus(200);
});

// generic function sending messages
function sendMessage(recipientId, message) {
    request({
        url: 'https://graph.facebook.com/v2.6/me/messages',
        qs: {access_token: process.env.PAGE_ACCESS_TOKEN},
        method: 'POST',
        json: {
            recipient: {id: recipientId},
            message: message,
        }
    }, function(error, response, body) {
        if (error) {
            console.log('Error sending message: ', error);
        } else if (response.body.error) {
            console.log('Error: ', response.body.error);
        }
    });
}

function receivedPostback(event) {
  var senderID = event.sender.id;
  var recipientID = event.recipient.id;
  var timeOfPostback = event.timestamp;

  // The 'payload' param is a developer-defined field which is set in a postback 
  // button for Structured Messages. 
  var payload = event.postback.payload;

  console.log("Received postback for user %d and page %d with payload '%s' " +
    "at %d", senderID, recipientID, payload, timeOfPostback);


  if (payload) {

    // When a postback is called, we'll send a message back to the sender to 
    // let them know it was successful
      switch (payload) {
        case 'USER_DEFINED_PAYLOAD':
          startedConv(senderID);
          break;

       default:
         sendTextMessage(senderID, "Postback called");
       }
    }
}

function startedConv(recipientId){
var name;

request({
          url: 'https://graph.facebook.com/v2.6/'+ recipientId +'?fields=first_name',
          qs: {access_token: process.env.PAGE_ACCESS_TOKEN},
          method: 'GET'
      }, function(error, response, body) {
          if (error) {
              console.log('Error sending message: ', error);
          } else if (response.body.error) {
              console.log('Error: ', response.body.error);
          }else{
              name = JSON.parse(body);
              sendTextMessage(recipientId, "Hello "+ name.first_name+", how can i help you ? ");
          }
      });
}
