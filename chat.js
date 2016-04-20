var http = require('http'),
fs = require('fs'),
io = require('socket.io'),
index;
fs.readFile('./index.html', function (err, data) {
 if (err) {
    throw err;
 }
 index = data;
});
var server = http.createServer(function(request, response) {
  response.writeHeader(200, {'Content-Type': 'text/html'});
  response.write(index);
  response.end();
}).listen(8008);

var socket = io.listen(server);

var users = {},
    ids = {},
    timers = {};

socket.on("connection", function (client) {

    ids[client.id] = {};
    //ids[client.id].id = client.id.replace(/\/#/, "");
    //client.emit("update", "You have connected to the server.");

    client.on("join", function(data){
        var user = null;

        if (!users[data.sid]) users[data.sid] = [];

        if (!data.admin){
            if (users[data.sid]){
                users[data.sid].forEach(function(item, i) {
                    if (item.id === data.id) {
                        user = item;
                        users[data.sid][i].online = true;
                        if (data.profile && !users[data.sid][i].profile) users[data.sid][i].profile = data.profile;
                        if (data.metrika) users[data.sid][i].metrika = data.metrika;
                    }
                });
            }
            if (!user){
                user = {
                    id: data.id,
                    online: true,
                    auth: false,
                    name: null,
                    avatar: null,
                    phone: null,
                    email: null,
                    lastMessage: null,
                    newMessages: 0,
                    joinTime: getTime(),
                    joinDate: null,
                    profile: data.profile,
                    metrika: data.metrika,
                    messages: []
                };
                users[data.sid].push(user);
            }
            else if (timers[user.id]){
                clearTimeout(timers[user.id]);
            }
        }
        ids[client.id].id = data.id;
        ids[client.id].sid = data.sid;
        ids[client.id].admin = data.admin;

        socket.sockets.emit("update_" + data.sid, users[data.sid]);
	});

	client.on("send", function(data){
        if (ids[client.id] && ids[client.id].sid){

            var id = data.id || ids[client.id].id,
                sid = ids[client.id].sid,
                isAdmin = ids[client.id].admin;

            socket.sockets.emit("chat_" + id + "_" + sid, {
                id: ids[client.id].id,
                type: data.type ? data.type : "chat",
                text: htmlLinks(htmlEscape(data.message)),
                time: getTime()
            });

            users[sid].forEach(function(item, i) {
                if (item.id === id) {
                    users[sid][i].lastMessage = htmlEscape(data.message);
                    if (!isAdmin) users[sid][i].newMessages++;
                    else users[sid][i].newMessages = 0;
                    users[sid][i].messages.push({
                        type: data.type ? data.type : "chat",
                        me: isAdmin ? false : true,
                        text: htmlLinks(htmlEscape(data.message)),
                        time: getTime(),
                        viewed: !isAdmin ? false : true
                    });
                }
            });
            socket.sockets.emit("update_" + sid, users[sid]);
            if (!isAdmin) socket.sockets.emit("notify_" + sid, id);
        }
	});

    client.on("answerOffer", function(data){
        if (ids[client.id] && ids[client.id].sid && data){
            var id = ids[client.id].id,
                sid = ids[client.id].sid;

            users[sid].forEach(function(item, i) {
                if (item.id === id) {
                    if (data.type === "name" || data.type === "profile"){
                        users[sid][i].name = data.name;
                        if (data.type === "profile"){
                            users[sid][i].name = data.name;
                            users[sid][i].avatar = data.avatar;
                            users[sid][i].profile = data.profile;
                        }
                        users[sid][i].messages.forEach(function(message, j) {
                            if (message.type === "auth") {
                                users[sid][i].messages[j].text = '<strong>' + data.name + '</strong> получена информация';
                            }
                        });
                        users[sid][i].auth = true;
                    }
                    else if (data.type === "phone"){
                        users[sid][i].phone = data.phone;
                        users[sid][i].messages.forEach(function(message, j) {
                            if (message.type === "phone") {
                                users[sid][i].messages[j].text = '<strong>' + htmlEscape(data.phone) + '</strong> телефон предоставлен';
                            }
                        });
                    }
                    else if (data.type === "email"){
                        users[sid][i].email = data.email;
                        users[sid][i].messages.forEach(function(message, j) {
                            if (message.type === "email") {
                                users[sid][i].messages[j].text = '<a href="mailto:' + data.email + '">' + htmlEscape(data.email) + '</a> предоставлен';
                            }
                        });
                    }
                }
            });
            socket.sockets.emit("update_" + sid, users[sid]);
            socket.sockets.emit("update_offer" + sid, data.type);
        }
    });

    client.on("viewed", function(i){
        var sid = ids[client.id].sid;
        users[sid][i].newMessages = 0;
        users[sid][i].messages.forEach(function(message, j) {
            message.viewed = true;
        });
    });

    client.on("typed", function(id){
        var id = id || ids[client.id].id;
        if (ids[client.id].admin){
            socket.sockets.emit("typed_" + id + "_" + ids[client.id].sid, true);
        }
        else {
            socket.sockets.emit("typed_" + ids[client.id].sid, id);
        }
    });

	client.on("disconnect", function(){
        if (ids[client.id] && ids[client.id].sid && !ids[client.id].admin){
            var id = ids[client.id].id,
                sid = ids[client.id].sid,
                num = null;

            users[sid].forEach(function(item, i) {
                if (item.id == id) {
                    num = i;
                    users[sid][i].online = false;
                }
            });

            if (!num) return;

            socket.sockets.emit("update_" + sid, users[sid]);

            timers[id] = setTimeout(function(){
                delete timers[id];
                delete ids[client.id];
                users[sid].splice(num, 1);
                socket.sockets.emit("update_" + sid, users[sid]);
            }, 5000);

            // timers[id] = setTimeout(function(){
            //     users[sid].forEach(function(item, i) {
            //         if (item.id === id) {
            //             num = i;
            //             users[sid][i].online = false;
            //         }
            //     });
            //     socket.sockets.emit("update_" + sid, users[sid]);
            //     timers[id] = setTimeout(function(){
            //         delete timers[id];
            //         delete ids[client.id];
            //         users[sid].splice(num, 1);
            //         socket.sockets.emit("update_" + sid, users[sid]);
            //     }, 5000);
            // }, 5000);
        }
	});

    var htmlEscape = function(text){
        return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    };

    var htmlLinks = function(text){
        var urlRegex =/\b((ht|f)tp(s)?:\/\/[\w]+[^ \,\"\n\r\t<]*)\b/gi;
        return text.replace(urlRegex, function(url) {
            return '<a href="' + url + '" target="_blank">' + url + '</a>';
        });
    };

    var getTime = function(){
        var date = new Date(),
            hours = date.getHours(),
            min = date.getMinutes();

        if (min < 10) min = "0" + min;

        return hours + ":" + min;
    };

});
