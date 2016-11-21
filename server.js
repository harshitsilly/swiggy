var express = require('express');
var proxy = require('http-proxy-middleware');

var app = express();

app.use('/api/*', proxy({target: 'https://www.swiggy.com', changeOrigin: true}));

app.use(express.static('www'));
app.set('port', process.env.PORT || 7000);
app.listen(app.get('port'), function () {
    console.log('Express server listening on port ' + app.get('port'));
});