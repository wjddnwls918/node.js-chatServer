var app = require('express')();
var server = require('http').createServer(app);
// http server를 socket.io server로 upgrade한다
var io = require('socket.io')(server);

var moment = require('moment-timezone');


// localhost:3000으로 서버에 접속하면 클라이언트로 index.html을 전송한다
app.get('/', function(req, res) {
  res.sendFile(__dirname + '/index-room.html');
});


var getCurrentTime = function() {

	var date = new Date();
	
	return moment(date.getTime()).tz("Asia/Tokyo").format("YYYY-MM-DD HH:mm:ss");
	//return today.getHours() +":" + today.getMinutes() +":"+ today.getSeconds();
}

// namespace /chat에 접속한다.
var chat = io.of('/chat').on('connection', function(socket) {
 
	socket.on('enter room', function(data) {
	 console.log('user id : ',data.name);
	 console.log('user enter room number : ',data.roomId);

		let name = socket.name = data.name;
		let roomId = socket.roomId = data.roomId;
		

		socket.join(roomId);
		chat.to(roomId).emit('enter room'
			,`${name}님께서 입장하셨습니다.`); 
	});
	
	socket.on('chat message', function(data){
    console.log('message from client: ', data);

    var name = socket.name = data.name;
    var roomId = socket.roomId = data.roomId;

    data.inputTime = getCurrentTime();

		console.log(data.inputTime);
    // room에 join한다
    //socket.join(room);
    // room에 join되어 있는 클라이언트에게 메시지를 전송한다
    chat.to(roomId).emit('chat message', data);
  });
});

server.listen(3000, function() {
  console.log('Socket IO server listening on port 3000');
});


