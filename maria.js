var http = require('http');
var mysql = require('mysql2');
var url = require('url');
var querystring = require('querystring');
var connection = mysql.createConnection({host:'localhost', user: 'root', database: 'tes', password:'malang123'});
http.createServer(function(req, res) {
	var requrl = url.parse(req.url);
	var sql = decodeURIComponent(querystring.parse(requrl.query).sql);
	if( sql !== 'undefined' && req.method.toLowerCase() == 'get' ) {
		connection.query(sql, function (err, results, fields) {
		  console.log(results, err);
		  res.end(JSON.stringify(results));
		});
	} else {
		res.end('404');
	}
}).listen(8877);