const socket = io.connect('http://localhost:3000', {'forceNew': true});
let username = null;
let roomName = null;

socket.on('new-user', function(data) {
  nick(data);
  join('Default');

  renderSubMessage(`Welcome <strong>${username}</strong>!`);
});

socket.on('bad-new-user', function(data) {
  username = 'none';
  nick(username);
  renderSubMessage(`Username <strong>${username}</strong> already exists!`);
});

socket.on('bad-new-chatroom', function(data) {
  roomName = 'none';
  create(roomName);
  renderSubMessage(`Chatroom <strong>${roomName}</strong> already exists!`);
});

socket.on('messages', function(data) {
  console.log(data);
  render(data);
});

function render(data) {
  const html = data.map(function(elem, index) {
    return (`<div>
      <strong>${elem.author}:</strong>
      <em>${elem.text}</em>
    </div>`)
  }).join(' ');

  document.getElementById('messages').innerHTML = html;
}

function addMessage(e) {
  const messageText = document.getElementById('text').value;
  if (messageText !== '') {
    if (messageText.startsWith('/')) {
      executeCommand(messageText);
    } else {
      sendMessage(messageText);
      renderSubMessage('');
    }
  }
  document.getElementById('text').value = '';
  return false;
}

function executeCommand(messageText) {
  const command = messageText.split(' ')[0];
  if (1 < messageText.split(' ').length) {
    const argument = messageText.split(' ')[1];
    switch (command) {
      case '/nick':
        nick(argument);
        break;
      case '/join':
        join(argument);
        break;
      case '/create':
        create(argument);
        break;
      default:
        renderSubMessage('Unknown command');
    }
  } else {
    renderSubMessage('Unknown command');
  }
}

function nick(newUsername) {
  username = newUsername;
  socket.emit('add-new-user', username);
  renderUsername();
  renderSubMessage('');
}

function renderUsername() {
  document.getElementById('username').innerHTML = `<strong>${username}</strong>: `;
}

function join(nextRoomName) {
  roomName = nextRoomName;
  renderChatRoom();
  renderSubMessage('');
}

function create(newRoomName) {
  roomName = newRoomName;
  socket.emit('add-new-chatroom', roomName);
  renderChatRoom();
  renderSubMessage('');
}

function renderChatRoom() {
  document.getElementById('chatroom').innerHTML = `Welcome to chat room: <em>${roomName}</em>`;
}

function sendMessage(messageText) {
  const message = {
    author: username,
    text: messageText
  };

  console.log('emitting new message');
  socket.emit('new-message', message);
}

function renderSubMessage(subMessage) {
  document.getElementById('submessage').innerHTML = `--- ${subMessage}`;
}
