window.onload = function() {

    var messages = [];
    var socket = io.connect();

    var field   = document.getElementById('field'),
        form    = document.getElementById('form'),
        content = document.getElementById('content'),
        name    = document.getElementById('name'),
        err     = document.getElementById('error'),
        uname   = document.getElementById('username');

    // emoticons
    $.getJSON('emoticons/emoticons.json', function(json) {
        var definition = json;
        $.emoticons.define(definition);
    });


    var user = '';

    var lsName = localStorage.getItem('chatName') || 'Guest';

    socket.emit('changename', { name: lsName });

    name.value = lsName;

    socket.on('message', function (data) {
        if(data.message) {
            messages.push(data);
            var html = '';
            for(var i=0; i<messages.length; i++) {
                if (messages[i].username) {
                    html += '<span class="' + (messages[i].username == user ? 'me' : 'user') + '">' + messages[i].username + ': </span>';
                } else {
                    html += '<span class="server">Server: </span>';
                }
                html += $.emoticons.replace(messages[i].message) + '<br>';
            }
            content.innerHTML = html;
            $('#content').animate({scrollTop: $('#content').prop('scrollHeight')});
        }
    });

    socket.on('count', function (data) {
        // User count
        var text;
        if (data.num == 1)
            text = "1 user online:";
        else
            text = data.num + " users online:";
        $('#usercount').text(text);

        // User names
        var users = '';
        for (var id in data.users) {
            users += data.users[id] + '<br>';
        }
        $('#usernames').html(users);
    });

    // Change username
    uname.onsubmit = function(e) {
        e.preventDefault();
        if(name.value == '') {
            err.innerHTML = "Please type your name!";
            err.classList.remove('hidden');
            name.focus();
        } else {
            err.classList.add('hidden');
            var newname = name.value;
            if (user !== newname) {
                if (user === '') {
                    socket.emit('send', { message: newname + " is now online" });
                } else {
                    socket.emit('send', { message: user + " is now known as " + newname + "!" });
                }
                socket.emit('changename', { name: newname });
                localStorage.setItem('chatName', newname) ;
                user = newname;
            }
            field.focus();
        }
    }

    // send message
    form.onsubmit = function(e) {
        e.preventDefault();
        if(name.value == '') {
            err.innerHTML = "Please type your name!";
            err.classList.remove('hidden');
            name.focus();
        } else {
            if (field.value == '') {
                err.innerHTML = "Please type a message!";
                err.classList.remove('hidden');
            } else {
                err.classList.add('hidden');
                var text = field.value;
                socket.emit('send', { message: text, username: name.value });
                field.value = "";
                field.focus();
            }
        }
    };

}
