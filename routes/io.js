const express = require('express');
const router = express.Router();

function ioRouter(io) {
  const nsp = io.of('/chatIo');

  nsp.on('connection', socket => {
    socket.broadcast.emit('userConnected');
    socket.emit('getUser');

    socket.on('setUser', user => {
      // console.log(`{${user} : ${socket.id}}`);
    });

    socket.on('disconnect', () => {
      socket.broadcast.emit('userDisconnected');
    });

    socket.on('newMessage', msg => {
      socket.broadcast.emit('messageAdded', msg);
    });
  });

  return router;
}

module.exports = ioRouter;
