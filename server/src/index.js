require("dotenv").config({ path: "../.env.local" });
const express = require('express');
const cors = require('cors');
const knex = require('./knex');
const { generateSalt, generateHashedPassword } = require('./authentication/password-hasher');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = 3000;
const SECRET_KEY = process.env.JWT_SECRET_KEY;

app.use(express.json());
app.use(cors());

// Verification middleware
const verifyToken = (req, res, next) => {
  const token = req.headers['authorization'];
  if (!token) {
    return res.status(403).json({ error: 'Token is required' }); 
  }

  try {
    const decoded = jwt.verify(token.split(' ')[1], SECRET_KEY);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid token' }); 
  }
};

app.post('/register', async (req, res) => {
  const { username, password } = req.body;
  const salt = generateSalt();
  const hashedPassword = generateHashedPassword(password, salt);

  try {
    const [user] = await knex('users').insert({
      username,
      password: hashedPassword,
      salt: salt
    }).returning('id');
    const userId = user.id;

    const items = await knex('items').select('id');
    const userItems = items.map(item => ({
      user_id: userId,
      item_id: item.id,
      is_checked: false
    }));
    await knex('user_items').insert(userItems);

    const token = jwt.sign({ userId, username }, SECRET_KEY, { expiresIn: '1h' });

    res.status(201).json({ userId, token });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ error: 'Error registering user' }); 
  }
});

app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await knex('users').where({ username }).first();

    if (!user) {
      return res.status(400).json({ error: 'User not found' }); 
    }

    const hashedPassword = generateHashedPassword(password, user.salt);

    if (hashedPassword !== user.password) {
      return res.status(401).json({ error: 'Invalid password' }); 
    }

    const token = jwt.sign({ userId: user.id, username: user.username }, SECRET_KEY, { expiresIn: '1h' });

    res.status(200).json({ userId: user.id, token });
  } catch (error) {
    console.error('Error logging in user:', error);
    res.status(500).json({ error: 'Error logging in user' }); 
  }
});

app.post('/refresh-token', async (req, res) => {
  const token = req.headers['authorization'];
  if (!token) {
    return res.status(403).json({ error: 'Token is required' });
  }

  try {
    const decoded = jwt.verify(token.split(' ')[1], SECRET_KEY, { ignoreExpiration: true });

    // Check if the user still exists in the database
    const user = await knex('users').where({ id: decoded.userId }).first();
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Generate a new token
    const newToken = jwt.sign({ userId: user.id, username: user.username }, SECRET_KEY, { expiresIn: '1h' });

    res.status(200).json({ token: newToken });
  } catch (error) {
    console.error('Error refreshing token:', error);
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
});


app.get("/api/items/:userId/:difficulty", verifyToken, async (req, res) => {
  const { userId, difficulty } = req.params;
  const difficultyMap = {
    Normal: 'Normal_Mode',
    Hard: 'Hard_Mode',
    Super_Hard: 'Super_Hard_Mode'
  };
  const dbDifficulty = difficultyMap[difficulty];

  if (!dbDifficulty) {
    return res.status(400).json({ error: 'Invalid difficulty' }); 
  }

  try {
    const items = await knex('user_items')
      .join('items', 'user_items.item_id', 'items.id')
      .select('items.id', 'items.name', 'items.location', 'items.difficulty', 'items.type', 'user_items.is_checked')
      .where('user_items.user_id', userId)
      .andWhere('items.difficulty', dbDifficulty)
      .orderBy('items.id');
    res.status(200).json(items);
  } catch (error) {
    console.error('Error fetching items:', error);
    res.status(500).json({ error: 'Error fetching items' }); 
  }
});

app.put("/api/items/reset/:userId", verifyToken, async (req, res) => {
  const { userId } = req.params;

  try {
    await knex('user_items')
      .where({ user_id: userId })
      .update({ is_checked: false });
    res.status(200).json({ message: 'All items reset to unchecked' }); 
  } catch (error) {
    console.error('Error resetting items:', error); 
    res.status(500).json({ error: 'Error resetting items' }); 
  }
});

app.put("/api/items/:userId/:itemId", verifyToken, async (req, res) => {
  const { userId, itemId } = req.params;
  const { is_checked } = req.body;

  try {
    await knex('user_items')
      .where({ user_id: userId, item_id: itemId })
      .update({ is_checked });
    res.status(200).json({ message: 'Item status updated' }); 
  } catch (error) {
    console.error('Error updating item status:', error); 
    res.status(500).json({ error: 'Error updating item status' }); 
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
