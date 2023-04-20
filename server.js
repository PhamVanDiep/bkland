let express = require('express');

let app = express();

app.use(express.static(__dirname + '/dist/bkland'));

app.get('/*', (req, res) => {
    res.sendFile(__dirname + '/dist/bkland/index.html');
});

app.listen(process.env.PORT || 8080);