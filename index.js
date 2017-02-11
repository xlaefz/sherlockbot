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
};


request.post({
    method: 'POST',
    uri: 'https://graph.facebook.com/v2.6/me/thread_settings?access_token=EAAazp7yTD5ABAImoZB5Oni2AdF0pU3UdEf2Ax0x33H5GS7ge7EECV2l7SAniZBNrY24Anw1ACoWQfcbJXZC0MCqbtdO3Li8DVEgTYRtunp1uiLNOn1kecYowS4WXeFUJuJidK6m2U9QDMd1tkcsw0KosjzClF5oCSH5G4D8SwZDZD',
    qs: {
        setting_type: 'call_to_actions',
        thread_state: 'new_thread',
            call_to_actions: [{
                payload: 'GET_START'
            }]
        },
    json: true
}, (err, res, body) => {
    // Deal with the response
});

request({
    method: 'POST',
    uri: 'https://graph.facebook.com/v2.6/me/messages',
    qs: {
        access_token: ACCESS_TOKEN
    },
    json: {
        recipient: {
            id: SENDER_ID
        },
        message: {
            attachment: {
                type: "template",
                payload: {
                    template_type: "generic",
                    elements: {
                        "title": "Your Title",
                        "subtitle": "Welcome to my messenger bot",
                        "image_url": "https://mybot.example.com/images/logo.jpg"
                    }
                }
            }
        }
    }
}, (err, res, body) => {
    // Deal with the response
});

