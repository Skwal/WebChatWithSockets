var express = require("express"),
    app = express(),
    port = 3700;

app.set('views', __dirname + '/tpl');
app.set('view engine', "jade");
app.engine('jade', require('jade').__express);
app.get("/", function(req, res){
    res.render('page');
});

app.use(express.static(__dirname + '/public'));

var io = require('socket.io').listen(app.listen(port));

var count = 0,
    users = {};

io.sockets.on('connection', function (socket) {

    count++;
    socket.set('nickname', 'Guest');
    users[socket.id] = 'Guest';

    io.sockets.emit('count', {
        num: count,
        users: users
    });

    socket.on('disconnect', function () {
        count--;
        delete users[socket.id];
        io.sockets.emit('count', {
            num: count,
            users: users
        });
    });

    socket.on('changename', function (data) {
        users[socket.id] = data.name;
        socket.set('nickname', data.name);
        console.log(users);
        io.sockets.emit('count', {
            num: count,
            users: users
        });
    });

    // Welcome message
    socket.emit('message', { message: 'Welcome to the chat - Please choose a username' });

    socket.on('send', function (data) {
        io.sockets.emit('message', data);
    });
});