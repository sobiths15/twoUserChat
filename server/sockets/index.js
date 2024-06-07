const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

module.exports = (io) => {
  io.on('connection', async (socket) => {
    try {
      const messages = await prisma.message.findMany({
        include: { user: true },
        orderBy: { id: 'asc' },
      });
      socket.emit('initialize', messages);
    } catch (e) {
      console.error('Database fetch error:', e);
    }

    socket.on('chat message', async ({ content, userId }) => {
      let result;
      try {
        result = await prisma.message.create({
          data: { content, userId },
          include: { user: true },
        });
      } catch (e) {
        console.error('Database insert error:', e);
        return;
      }
      io.emit('chat message', { id: result.id, content: result.content, user: result.user });
    });
  });
};
