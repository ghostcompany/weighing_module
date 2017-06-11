var express = require("express");
var jwt = require('jsonwebtoken');
var bcrypt = require('bcrypt');
var bodyParser = require("body-parser");
var requestApi = require('req');
/*
bcrypt.hash('myPassword', 9, function(err, hash) {
  console.log(hash);
  bcrypt.compare('myPassword', hash, function(err, res) {
      if(res) {
        console.log('match');
      } else {
        console.log('not match');
      } 
    });
});
*/
var app = express();
app.use(bodyParser.urlencoded({
  extended: true
}));
app.get("/", function(req, res) {
    res.json({message: "Express is up!"});
});
app.post("/signup", function(req, res) {
    console.log(req.body);
    bcrypt.hash(req.body.password, 9, function(err, hash) {
        var sql = 'INSERT INTO docs.users VALUES ("'+ hash.substring(7,18) +'", COLUMN_CREATE("hash","'+ hash +'","username","'+ req.body.username +'"))';
        requestApi('http://localhost:8877/test?sql=' + escape(sql), function(reqHttp, result){
            console.log(result);
        });
        res.end('good');
    });
});
app.post("/login", function(req, res) {
    bcrypt.hash(req.body.password, 9, function(err, hash) {
        var sql = 'SELECT id , CONVERT(COLUMN_JSON(docs) USING utf8) as docs FROM docs.users Where id ="'+ hash.substring(7,18) +'"';
        requestApi('http://localhost:8877/test?sql=' + escape(sql), function(reqHttp, result){
            console.log(result);
        });
        res.end('good');
    });
});
app.listen(3000, function() {
  console.log("Express running");
});
/*
var token = jwt.sign({ foo: 'bar' }, 'shhhhh');
//backdate a jwt 30 seconds
var older_token = jwt.sign({ foo: 'bar', iat: Math.floor(Date.now() / 1000) - 30 }, 'shhhhh');
console.log(token);
console.log(older_token);

try {
  var decoded = jwt.verify(token, 'shhhhh');
  var decoded2 = jwt.verify(older_token, 'shhhhh');
  console.log(decoded);
  console.log(decoded);
} catch(err) {
  // err
}
*/