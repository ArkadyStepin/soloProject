const express = require('express');
const app = express();
const path = require('path');

app.set('view engine', 'html');
app.use(express.static(__dirname + '/public'));

app.get('/', function (req, res) { // для использования с файлом
  res.sendFile(__dirname + '/index.html')
});

// app.get('/', function (req, res) { // для использования с микрофоном
//   res.sendFile(__dirname + '/indexMic.html')
// });

const PORT = 3002;

app.listen(PORT, () => console.log('serv is ready 3002'));
