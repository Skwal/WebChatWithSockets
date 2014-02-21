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

var ent = require('ent');

var count = 0,
    users = {};

io.sockets.on('connection', function (socket) {

    count++;
    socket.set('nickname', 'Guest');
    users[socket.id] = 'Guest';

    socket.set('lastmsg', 0);

    var updateList = function() {
        io.sockets.emit('count', {
            num: count,
            users: users
        });
    }

    updateList();

    socket.on('disconnect', function () {
        count--;
        io.sockets.emit('message', {
            message: users[socket.id] + " is now offline!"
        });
        delete users[socket.id];
        updateList();
    });

    socket.on('changename', function (data) {
        users[socket.id] = ent.encode(data.name);
        socket.set('nickname', ent.encode(data.name));
        updateList();
    });

    socket.on('send', function (data) {
        var now = Date.now();
        socket.get('lastmsg', function(err, value) {
            if (now - value > 2000) {
                socket.set('lastmsg', now);
                if (data.username && data.username !== users[socket.id]) {
                    users[socket.id] = ent.encode(data.username);
                    updateList();
                }
                data.message = ent.encode(data.message);
                io.sockets.emit('message', data);
            }
        });
    });

    // Welcome message
    socket.emit('message', { message: 'Welcome to the chat - Please choose a username' });
});