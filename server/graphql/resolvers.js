const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const resolvers = {
  Query: {
    users: async () => prisma.user.findMany(),
    messages: async () => prisma.message.findMany({ include: { user: true } }),
  },
  Mutation: {
    addUser: async (_, { name }) => {
      return prisma.user.create({ data: { name } });
    },
    addMessage: async (_, { content, userId }) => {
      const message = await prisma.message.create({
        data: { content, userId },
        include: { user: true },
      });
      io.emit('chat message', { id: message.id, content: message.content, user: message.user });
      return message;
    },
  },
};

module.exports = resolvers;
