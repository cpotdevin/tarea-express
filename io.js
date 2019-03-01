const socket = require('socket.io');
const usernameGenerator = require('username-generator');
const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('database.sqlite');

let messages = [];

function startConnection(server) {
  const io = socket(server);

  io.on('connection', function(socket) {
    console.log('New connection to socket');

    socket.on('validate-new-user', async function(data) {
      console.log('validando usuario');
      db.all(`SELECT * FROM user WHERE username = '${data}';`, function(err, rows) {
        io.sockets.emit('bad-new-user', data);
      });
    })

    socket.on('add-new-user', function(data) {
      db.all(`SELECT * FROM user WHERE username = '${data}';`, function(err, rows) {
        if (rows.length === 0) {
          db.run(`INSERT INTO user(username) VALUES('${data}')`);
        } else {
          io.sockets.emit('bad-new-user', data);
          console.error('usuario repetido');
        }
      });
    });

    socket.on('add-new-chatroom', function(data) {
      db.all(`SELECT * FROM chatroom WHERE name = '${data}';`, function(err, rows) {
        if (rows.length === 0) {
          db.run(`INSERT INTO chatroom(name) VALUES('${data}')`);
        } else {
          io.sockets.emit('bad-new-chatroom', data);
          console.error('chatroom repetido');
        }
      });
    });

    socket.on('new-message', function(data) {
      messages.push(data);
      io.sockets.emit('messages', messages);
    });

    io.sockets.emit('new-user', usernameGenerator.generateUsername('-'));
  });
}

module.exports.startConnection = startConnection;