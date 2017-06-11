var http = require("http"),
    url = require("url"),
    path = require("path"),
    fs = require("fs")
    port = process.argv[2] || 7676;

http.createServer(function(request, response) {
  var urlWindows = path.join(__dirname, '..', '..', '\\html\\www');
  var urlCdn = path.join(__dirname, '..', '..', '\\html\\cdn');
  var uri = url.parse(request.url).pathname
  var filename = path.join(urlWindows, uri);
  var arrUrl = uri.split('/');
  console.log(arrUrl[arrUrl.length - 1]);
  if( ['.css', '.js', '.img', '.woff', '.ttf', '.jpg', '.woff2', '.png' ].indexOf( path.extname(filename) ) > -1 && arrUrl[arrUrl.length - 1].indexOf('index') === -1)  {
    filename = path.join(urlCdn, uri);
  }
  var contentTypesByExtension = {
    '.html': "text/html",
    '.css':  "text/css",
    '.js':   "text/javascript"
  };

  fs.exists(filename, function(exists) {
    console.log(filename, exists);
    if(!exists) {
      response.writeHead(404, {"Content-Type": "text/plain"});
      response.write("404 Not Found\n");
      response.end();
      return;
    }

    if (fs.statSync(filename).isDirectory()) filename += '/index.html';

    fs.readFile(filename, "binary", function(err, file) {
      if(err) {
        response.writeHead(500, {"Content-Type": "text/plain"});
        response.write(err + "\n");
        response.end();
        return;
      }

      var headers = {};
      var contentType = contentTypesByExtension[path.extname(filename)];
      if (contentType) headers["Content-Type"] = contentType;
      response.writeHead(200, headers);
      response.write(file, "binary");
      response.end();
    });
  });
}).listen(parseInt(port, 10));

console.log("Static file server running at\n  => http://localhost:" + port + "/\nCTRL + C to shutdown");
