var express = require('express');
var app = express();
var path = require('path');
const PORT = 8080

app.use(express.static(path.join(__dirname)))
app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname + '/index.html'));
});

app.listen(PORT, () => console.log(`Server listening on http://localhost:${PORT}`))