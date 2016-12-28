var socket = io.connect('http://localhost');

socket.on('clear', function() {
    $('.todoList').empty();
    $('.checkedList').empty();
    $('.list').append('<p>Здесь пока нет записей, добавьте их!');
});

socket.on('list', function(data) {
    $('.todoList').empty();
    $('.checkedList').empty();
    $('p').remove();
    data.forEach(function(el) {
        if (el.checked) $('.checkedList').append('<li id="' + el.id + '">' + el.value + '</li>');
        else $('.todoList').append('<li id="' + el.id + '">' + el.value + '</li>');
    });
});

$(document).ready(function() {
    $('#addtodo').click(function() {
        let value = prompt('Добавьте новую цель.');
        socket.emit('add', {
            value: value
        });
    });

    $('#cleartodo').click(function() {
        socket.emit('clear');
    });

    $('.todoList').delegate('li', 'click', function() {
        let id = $(this).attr('id');
        socket.emit('check', {
            id: id
        });
    });

});
