const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const path = require('path');
const port = 4000;
const mqtt = require('mqtt');
const fs = require('fs');
var client;

// server or this server means localhost:3000
// broker means mqtt broker server
app.use(express.static(path.join(__dirname, 'public')));
app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});
server.listen(port, function(){
  // when this server is opened 
  console.log('listening on port ' + port);
  
  io.on('connection', function (socket) {
    // when user connect with this server
    console.log(port + " CONNECTED");

    // when send button clicked in html file
    socket.on('new:messageSend', function (topic, msg) {
      client.publish(topic, msg);
    });

    // when disconnect Button clicked in html file
    socket.on('new:disconnect', function(){
      client.end();
      io.emit('new:disconnected');
      console.log("연결해제됨");
    });

    // When connect Button clicked in html file (host and port sended from html)
    socket.on('new:connect', function (host, port) {
      var option = {
        host: host,
        port : port,
        protocol: 'ws',                                           // protocol is WebSocket
        protocolId: 'MQIsdp',
        protocolVersion: 3,
        secureProtocol: 'TLSv1_method',
        reconnectPeriod: 5 * 1000,
        rejectUnauthorized: false,                                // to use self-signed crt 
        connectTimeout: 10 * 1000,
        ca: [fs.readFileSync('C:/LastOne/keystore/ca/ca.crt')],
        key: fs.readFileSync('C:/LastOne/keystore/client/client.key'),
        cert: fs.readFileSync('C:/LastOne/keystore/client/client.crt')
      };
      client = mqtt.connect(option);                              // connect to mqtt broker with option
      client.on('connect', function () {
        client.subscribe('#', function (err) {                        // subscribe all topics
          if (!err) {                                                 // when connected
            io.emit('new:mqttconnected');                             // notice connected well to html file
            console.log("MQTT_CONNECTED ON "+host+':'+port);          
          }
        });
      });
      client.on('message', (topic, message) => {                  // when message arrived
        io.emit('new:messageArrived',topic, message.toString());  // notice message arrived and send topic&message to html file
      });
      client.on('mqttdisconnect', (error) => {                    // when disconnected [ERROR]
       client.end();                                              
       io.emit('error', "CONNECTION_DISCONNECTED");
     });
       client.on('offline', (error) => {                          // when broker is offline
       client.end();                                              // ask to disconnect
       io.emit('error', "BROKER_OFFLINE");                        // notice error occured to html file
     });
     });
  });
});