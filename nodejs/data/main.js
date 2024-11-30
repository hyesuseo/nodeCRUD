var http = require('http');
var fs = require('fs');
var url = require('url');
var qs = require("querystring");
 
function templateHTML(title, list, body, control){
  return `
  <!doctype html>
  <html>
  <head>
    <title>WEB1 - ${title}</title>
    <meta charset="utf-8">
  </head>
  <body>
    <h1><a href="/">WEB</a></h1>
    ${list}
    ${control}
    ${body}
  </body>
  </html>
  `;
}
function templateList(filelist){
  var list = '<ul>';
  var i = 0;
  while(i < filelist.length){
    list = list + `<li><a href="/?id=${filelist[i]}">${filelist[i]}</a></li>`;
    i = i + 1;
  }
  list = list+'</ul>';
  return list;
}
 
var app = http.createServer(function(request,response){
    var _url = request.url;
    var queryData = url.parse(_url, true).query;
    var pathname = url.parse(_url, true).pathname;
    if(pathname === '/'){
      //console.log("pathname: ", pathname);
      if(queryData.id === undefined){
        fs.readdir('./data', function(error, filelist){
          var title = 'Welcome';
          var description = 'Hello, Node.js';
          var list = templateList(filelist);
          var template = templateHTML(title, list, `<h2>${title}</h2>${description}`, `<a href="/create">create</a>`);
          response.writeHead(200);
          response.end(template);
        });
      } else {
        fs.readdir('./data', function(error, filelist){
          fs.readFile(`data/${queryData.id}`, 'utf8', function(err, description){
            var title = queryData.id;
            var list = templateList(filelist);
            var template = templateHTML(title, list, `<h2>${title}</h2>${description}`, 
              `<a href="/create">create</a> <a href="/update?id=${title}">update</a>
              <form action="delete_process" method="post">
              <input type="hidden" name="id" value=${title}> 
              <input type ="submit" value="delete"> </form>`);
            response.writeHead(200);
            response.end(template);
          });
        });
      }
    } else if(pathname === '/create'){
      ///console.log("pathname: ", pathname);
      fs.readdir('./data', function(error, filelist){
        var title = 'WEB - create';
        var list = templateList(filelist);
        var template = templateHTML(title, list, `
          <form action="/create_process" method="post">
            <p><input type="text" name="title" placeholder="title"></p>
            <p>
              <textarea name="description" placeholder="description"></textarea>
            </p>
            <p>
              <input type="submit">
            </p>
          </form>
        `,'');
        response.writeHead(200);
        response.end(template);
      });
    } else if(pathname ==='/create_process'){
      //console.log("pathname: ", pathname);
      var body = '';
      request.on('data', function(data){ 
        //post방식으로 데이터를 전송할때 데이터가 많을 경우 조각조각을 수신할때마다 콜백 함수를 호출하도록 되어있음
        //data라는 인자를 통해 수신한 정보를 준다.
        body += data; //콜백이 실행될 때마다 body에 데이터를 추가한다
      });
      request.on('end',function(){
        //더이상 들어오는 정보가 없으면 end -정보 수신이 끝난다.
        var post = qs.parse(body); //qs 모듈이 가진 parse라는 함수에 body를 넣어준다.
        var title = post.title;
        var description = post.description;
        fs.writeFile(`data/${title}`, description, 'utf8', function(err){
          response.writeHead(302, {Location: `/?id=${title}`});
          response.end('success');
          
        })
      })
           

    } else if (pathname ==='/update'){
      //console.log("pathname: ", pathname);
      fs.readdir('./data', function(err,filelist){
        fs.readFile(`data/${queryData.id}`, 'utf8', function(err, description){
          var title = queryData.id;
          var list = templateList(filelist);
          var template = templateHTML(title, list, `<form action="/update_process" method="post">
            <input type="hidden" name="id" value="${title}"> <!--수정되지 않은 수정될 파일의 이름을 저장-->
            <p><input type="text" name="title" placeholder="title" value=${title}></p>
            <p>
              <textarea name="description" placeholder="description">${description}></textarea>
            </p>
            <p>
              <input type="submit">
            </p>
          </form>
        `, `<a href="/create">create</a> <a href="/update?id=${title}">update</a>`);
          
         
          response.writeHead(200);
          response.end(template);
        });
      }); 
      }else if (pathname === '/update_process'){
        var body = '';
        request.on('data', function(data){ 
          
          body += data; 
        });
        request.on('end',function(){
          
          var post = qs.parse(body);
          var id = post.id;
          var title = post.title;
          var description = post.description;
          
          fs.rename(`data/${id}`, `data/${title}`, function(err){

          });
          fs.writeFile(`data/${title}`, description, 'utf8', function(err){
            response.writeHead(302, {Location: `/?id=${title}`});
            response.end('success');
            
          })
          
        })
      }else if (pathname === '/delete_process'){
        var body = '';
        request.on('data', function(data){ 
          
          body += data; 
        });
        request.on('end',function(){
          
          var post = qs.parse(body);
          var id = post.id;
          fs.unlink(`data/${id}`, function(error){
            response.writeHead(302, {Location:`/`});
            response.end();
          })
        })
      }else {
      response.writeHead(404);
      response.end('Not found');
    
    }
     
        
 
 
 
});

app.listen(3011 , console.log("3011 서버 연결"));