const express = require('express');
const { createServer } = require('http');
const { Server } = require('socket.io');

const app = express();
const httpServer = createServer(app);

// Create Socket.IO server with CORS configuration
const io = new Server(httpServer, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

// Mock data generator
function generateMockNotification(id) {
  return {
    id,
    type: 'new_message',
    content: `This is a test notification message ${id}. Long message content that should be truncated.`,
    status: 'unread',
    data: {
      type: 'new_message',
      fromEmail: 'test@example.com',
      referenceId: Math.floor(Math.random() * 1000),
      referenceName: `Test Project ${Math.floor(Math.random() * 100)}`,
      referenceType: 'project',
    },
    createdAt: new Date().toISOString(),
  };
}

// Socket.IO connection handler
io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);

  // Verify auth token if provided
  const { token } = socket.handshake.auth;
  if (token) {
    console.log('Authenticated with token:', token);
  }

  // Send a welcome notification
  socket.emit('new_notification', generateMockNotification(Date.now()));

  // Setup periodic notifications (every 10 seconds)
  const notificationInterval = setInterval(() => {
    const notification = generateMockNotification(Date.now());
    console.log('Sending notification:', notification);
    socket.emit('notification', notification);
  }, 10000);

  // Command line interface to send notifications
  process.stdin.on('data', (data) => {
    const input = data.toString().trim();
    if (input === 'n') {
      const notification = generateMockNotification(Date.now());
      console.log('Manually sending notification:', notification);
      socket.emit('notification', notification);
    }
  });

  // Handle disconnection
  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
    clearInterval(notificationInterval);
  });
});

// Start server
const PORT = process.env.PORT || 3003;
httpServer.listen(PORT, () => {
  console.log(`Socket.IO server running on port ${PORT}`);
  console.log('Press "n" + Enter to send a test notification');
});

// Error handling
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
});

process.on('unhandledRejection', (err) => {
  console.error('Unhandled Rejection:', err);
});
