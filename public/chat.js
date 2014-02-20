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
    var definition = {
        "smile": {
            "title": "Smile",
            "codes": ["&colon;&rpar;", "&colon;&equals;&rpar;", "&colon;-&rpar;"]
        },
        "sad-smile": {
            "title": "Sad Smile",
            "codes": ["&colon;&lpar;", "&colon;&equals;&lpar;", "&colon;-&lpar;"]
        },
        "big-smile": {
            "title": "Big Smile",
            "codes": ["&colon;D", "&colon;&equals;D", "&colon;-D", "&colon;d", "&colon;&equals;d", "&colon;-d"]
        },
        "cool": {
            "title": "Cool",
            "codes": ["8&rpar;", "8&equals;&rpar;", "8-&rpar;", "B&rpar;", "B&equals;&rpar;", "B-&rpar;", "&lpar;cool&rpar;"]
        },
        "wink": {
            "title": "Wink",
            "codes": ["&colon;o", "&colon;&equals;o", "&colon;-o", "&colon;O", "&colon;&equals;O", "&colon;-O"]
        },
        "crying": {
            "title": "Crying",
            "codes": ["&semi;&lpar;", "&semi;-&lpar;", "&semi;&equals;&lpar;"]
        },
        "sweating": {
            "title": "Sweating",
            "codes": ["&lpar;sweat&rpar;", "&lpar;:&VerticalLine;"]
        },
        "speechless": {
            "title": "Speechless",
            "codes": ["&colon;&VerticalLine;", "&colon;&equals;&VerticalLine;", "&colon;-&VerticalLine;"]
        },
        "kiss": {
            "title": "Kiss",
            "codes": ["&colon;&midast;", "&colon;&equals;&midast;", "&colon;-&midast;"]
        },
        "tongue-out": {
            "title": "Tongue Out",
            "codes": ["&colon;P", "&colon;&equals;P", "&colon;-P", "&colon;p", "&colon;&equals;p", "&colon;-p"]
        },
        "blush": {
            "title": "Blush",
            "codes": ["&lpar;blush&rpar;", "&colon;&dollar;", "&colon;-&dollar;", "&colon;&equals;&dollar;", "&colon;&bsol;&gt;"]
        },
        "wondering": {
            "title": "Wondering",
            "codes": ["&colon;^&rpar;"]
        },
        "sleepy": {
            "title": "Sleepy",
            "codes": ["&VerticalLine;-&rpar;", "I-&rpar;", "I&equals;&rpar;", "&lpar;snooze&rpar;"]
        },
        "dull": {
            "title": "Dull",
            "codes": ["&VerticalLine;&lpar;", "&VerticalLine;-&lpar;", "&VerticalLine;&equals;&lpar;"]
        },
        "in-love": {
            "title": "In love",
            "codes": ["&lpar;inlove&rpar;"]
        },
        "evil-grin": {
            "title": "Evil grin",
            "codes": ["]&colon;&rpar;", ">&colon;&rpar;", "&lpar;grin&rpar;"]
        },
        "talking": {
            "title": "Talking",
            "codes": ["&lpar;talk&rpar;"]
        },
        "yawn": {
            "title": "Yawn",
            "codes": ["&lpar;yawn&rpar;", "&VerticalLine;-&lpar;&rpar;"]
        },
        "puke": {
            "title": "Puke",
            "codes": ["&lpar;puke&rpar;", "&colon;&", "&colon;-&", "&colon;&equals;&"]
        },
        "doh!": {
            "title": "Doh!",
            "codes": ["&lpar;doh&rpar;"]
        },
        "angry": {
            "title": "Angry",
            "codes": ["&colon;@", "&colon;-@", "&colon;&equals;@", "x&lpar;", "x-&lpar;", "x&equals;&lpar;", "X&lpar;", "X-&lpar;", "X&equals;&lpar;"]
        },
        "it-wasnt-me": {
            "title": "It wasn't me",
            "codes": ["&lpar;wasntme&rpar;"]
        },
        "party": {
            "title": "Party!!!",
            "codes": ["&lpar;party&rpar;"]
        },
        "worried": {
            "title": "Worried",
            "codes": ["&colon;S", "&colon;-S", "&colon;&equals;S", "&colon;s", "&colon;-s", "&colon;&equals;s"]
        },
        "mmm": {
            "title": "Mmm...",
            "codes": ["&lpar;mm&rpar;"]
        },
        "nerd": {
            "title": "Nerd",
            "codes": ["8-&VerticalLine;", "B-&VerticalLine;", "8&VerticalLine;", "B&VerticalLine;", "8&equals;&VerticalLine;", "B&equals;&VerticalLine;", "&lpar;nerd&rpar;"]
        },
        "lips-sealed": {
            "title": "Lips Sealed",
            "codes": ["&colon;x", "&colon;-x", "&colon;X", "&colon;-X", "&colon;#", "&colon;-#", "&colon;&equals;x", "&colon;&equals;X", "&colon;&equals;#"]
        }
    };

    $.emoticons.define(definition);

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
                // console.log(messages[i].message);
                console.log($.emoticons.replace(messages[i].message));
                html += $.emoticons.replace(messages[i].message) + '<br>';
            }
            content.innerHTML = html;
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
