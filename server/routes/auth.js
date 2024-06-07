const express = require('express');
const { PrismaClient } = require('@prisma/client');
const router = express.Router();
const prisma = new PrismaClient();

router.post('/register', async (req, res) => {
  const { name } = req.body;
  try {
    const user = await prisma.user.create({ data: { name } });
    req.session.userId = user.id;
    res.json(user);
  } catch (e) {
    res.status(400).json({ error: 'User already exists' });
  }
});

router.post('/login', async (req, res) => {
  const { name } = req.body;
  const user = await prisma.user.findUnique({ where: { name } });
  if (user) {
    req.session.userId = user.id;
    res.json(user);
  } else {
    res.status(400).json({ error: 'User not found' });
  }
});

module.exports = router;
