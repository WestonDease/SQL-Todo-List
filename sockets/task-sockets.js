const users = {}
module.exports = function(io){
    io.on('connection', function(socket){
        console.log('connected');

        socket.on('new-name', function(data) {
            console.log(data);

            users[data.name] = socket;
            io.emit('emit-users', Object.keys(users));
        });

        socket.on('new-todo', function(newData){
            console.log("incoming new todo", newData);
            io.emit("new-todo", newData);
            // const socket1 = users[newData.user1];
            // const socket2 = users[newData.user2];
            // console.log(Object.keys(users));
            // socket1.emit('emit-message', newData);
            // socket2.emit('emit-message', newData);
        })

        socket.on('check-todo', function(newData) {
            console.log(newData);
            io.emit('check-todo', newData);
        });
    });
}