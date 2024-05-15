exports.seed = async function(knex) {
    // Delete all existing entries
    await knex('user_items').del();
  
    // Get the user ID of the newly created test user
    const user = await knex('users').where({ username: 'bingus' }).first();
  
    // Insert user item data which defaults to all false
    const items = await knex('items').select('id');
  
    const userItems = items.map(item => ({
      user_id: user.id,
      item_id: item.id,
      is_checked: false
    }));
  
    await knex('user_items').insert(userItems);
  };
  