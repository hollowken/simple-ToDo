var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var fs = require('fs');
var file = __dirname + '/list.txt';

var countID = 1;

app.use(express.static(__dirname + '/bower_components'));
app.use(express.static('./'));
app.get('/', function(req, res, next) {
    res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket) {
    let todoList = [];
    fs.readFile(file, 'utf8', function(err, data) {
        if (err) {
            throw err;
        }
        if (!data) {
            socket.emit('clear');
        } else {
            todoList = data.split('|');
            todoList.pop();
            for (var i = 0; i < todoList.length; i++) {
                todoList[i] = JSON.parse(todoList[i]);
            }
            socket.emit('list', todoList);
        }
    });

    socket.on('add', function(data) {
        countID = todoList.length + 1;
        data = {
            value: data['value'],
            id: countID,
            checked: false
        };
        data = JSON.stringify(data);
        data = JSON.parse(data);
        todoList.push(data);
        socket.emit('list', todoList);
    });

    socket.on('clear', function() {
        todoList = [];
        socket.emit('clear');
    });

    socket.on('disconnect', function() {
        let stream = fs.createWriteStream(file, {
            flags: 'w',
            defaultEncoding: 'utf8',
            fd: null,
            mode: 0o666,
            autoClose: true
        });
        for (var i = 0; i < todoList.length; i++) {
            stream.write(JSON.stringify(todoList[i]) + '|', "utf8", function(err) {
                if (err) throw err;
            });
        }
    });

    socket.on('check', function(data) {
        todoList.forEach(function(el) {
            if (el.id == data.id) el.checked = true;
        });
        socket.emit('list', todoList);
        console.log('принял');
    });
});

server.listen(80);
