var http = require('http');
var fs = require('fs');
const url = require('url');
var app = http.createServer(function(request,response){
    var _url = request.url;
    var queryData = url.parse(_url, true).query;
      console.log(queryData.id);
    var title = queryData.id;
    
      if(_url == '/'){
      title='WELCOME';
      }
      if(_url == '/favicon.ico'){
      
      response.writeHead(404)}
      fs.readFile(`data/${queryData.id}`,'utf8', function(err, description){
        console.log(description);
      var template =`<!doctype html>
      <html>
      <head>
        <title>WEB1 - ${title}</title>
        <meta charset="utf-8">
      </head>
      <body>
        <h1><a href="/">WEB</a></h1>
        <ul>
          <li><a href="/?id=HTML">HTML</a></li>
          <li><a href="/?id=CSS">CSS</a></li>
          <li><a href="/?id=Javascript">JavaScript</a></li>
        </ul>
        <h2>${title}</h2>
        <p>${description}</p>
      </body>
      </html>
      `;
      
      response.end(template);
       
      });
    });
    
    //response.end();
   
    
    
    //console.log(__dirname + url);
    //response.end(queryData.id);
    //response.end('egoing: '+ url);

    

app.listen(3011, console.log("3011 연결"))