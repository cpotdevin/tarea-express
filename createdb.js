const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('database.sqlite');

db.all('SELECT * FROM user;', function(err, rows) {
  console.log(rows);
});

db.all('SELECT * FROM chatroom;', function(err, rows) {
  console.log(rows);
});

// db.run('DROP TABLE message;');
// db.run('DROP TABLE chatroom;');
// db.run('DROP TABLE user;');
// db.run(
//   `CREATE TABLE user(
//     userid INTEGER PRIMARY KEY,
//     username TEXT UNIQUE
//   );`
// );

// db.run(
//   `CREATE TABLE chatroom(
//     chatroomid INTEGER PRIMARY KEY,
//     name TEXT UNIQUE
//   );`
// );

// db.run(
//   `INSERT INTO chatroom(
//     name
//   )
//   VALUES (
//     'Default'
//   );`
// );

// db.run(
//   `CREATE TABLE message(
//     id INTEGER PRIMARY KEY,
//     userid INTEGER,
//     chatroomid INTEGER,
//     FOREIGN KEY(userid) REFERENCES user(userid),
//     FOREIGN KEY(chatroomid) REFERENCES chatroom(chatroomid)
//   );`
// );
