const express = require('express');
const cors = require('cors');
const knex = require('./knex'); 

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(cors());

app.get("/api/items/:userId/:difficulty", async (req, res) => {
  const { userId, difficulty } = req.params;
  const difficultyMap = {
    Normal: 'Normal_Mode',
    Hard: 'Hard_Mode',
    Super_Hard: 'Super_Hard_Mode'
  };
  const dbDifficulty = difficultyMap[difficulty];

  if (!dbDifficulty) {
    return res.status(400).send('Invalid difficulty');
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
    res.status(500).send('Error fetching items');
  }
});

app.put("/api/items/reset/:userId", async (req, res) => {
  const { userId } = req.params;

  try {
    await knex('user_items')
      .where({ user_id: userId })
      .update({ is_checked: false });
    res.status(200).send('All items reset to unchecked');
  } catch (error) {
    console.error('Error resetting items:', error); 
    res.status(500).send('Error resetting items');
  }
});

app.put("/api/items/:userId/:itemId", async (req, res) => {
    const { userId, itemId } = req.params;
    const { is_checked } = req.body;

    try {
      await knex('user_items')
        .where({ user_id: userId, item_id: itemId })
        .update({ is_checked });
      res.status(200).send('Item status updated');
    } catch (error) {
      console.error('Error updating item status:', error); 
      res.status(500).send('Error updating item status');
    }
  });


app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
