/**
 * Created by matknu on 2015-12-25.
 */
var express = require('express');
var app = express();

app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname + '/dist'));

// views is directory for all template files
app.set('views', __dirname + '/dist');
app.set('view engine', 'ejs');

app.get('/', function(request, response) {
    response.render('index');
});
app.get('/bids/',function(request,response){
    getBids((bids)=>{
          response.status(200);
          response.send(bids);
    })
});
app.listen(app.get('port'), function() {
    console.log('Node app is running on port', app.get('port'));
});

var http = require('https');
var getBids = (cb) => {
    http.get({
        host: 'objekt.fastighetsbyran.se',
        path: '/Objekt/Budgivning/GetSenasteBud?ObjektId=1636306',
        headers: {
            'User-Agent': 'Mozilla/5.0 (Windows; U; Windows NT 5.1; en-US; rv:1.8.1.13) Gecko/20080311 Firefox/2.0.0.13'
        }
    }, (response) => {
        response.on('data', (data) => {
            cb(cheerio.load(data)('.bidsTable .bid').slice(1).map(function (i, link) {
                return cheerio(link).text().replace(/ |kr|\n|\r/g, '').toString();
            }).toArray());
        });
    });
}
