var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);
var names = [];

app.use('/',express.static(__dirname+'/www'));
/*app.get('/',function(req,res){
	res.sendfile(__dirname+'/www/index.html')
});*/
server.listen(process.env.PORT || 3000)
io.on('connect',function(socket){
	socket.on('login',function(name){
		for(var i=0;i<names.length;i++){
			if(names[i] === name){
				socket.emit('duplicate');
				return ;
			}
		}		
		names.push(name);
		io.sockets.emit('login',name);
		io.sockets.emit('sendClients',names);
	});

	socket.on('chat',function(data){
		io.sockets.emit('chat',data);
	});

	socket.on('logout',function(name){
		for(var i=0;i<names.length;i++){
			if(names[i] === name){
				names.splice(i,1);
				break;
			}
		}
		socket.broadcast.emit('logout',name);
		io.sockets.emit('sendClients',names);
	});
});