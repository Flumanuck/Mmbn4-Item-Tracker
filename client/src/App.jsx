import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DifficultyButtons from './components/DifficultyButtons.jsx';
import ItemList from './components/ItemList.jsx';
import ResetButton from './components/ResetButton';
import './App.css';

const BASE_URL = import.meta.env.VITE_BASE_URL;

function App(){
  const [difficulty, setDifficulty] = useState('Normal');
  const [items, setItems] = useState([]); 
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const userId = 1;

  useEffect(() => {
    handleFetchItems();
  }, []);

  useEffect(() => {
    handleFetchItems();
  }, [difficulty]);

  // Handler functions
  const handleFetchItems = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/api/items/1/${difficulty}`);
      const data = response.data;
      setItems(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching items:', error);
      setItems([]); //making sure items is an array
    }
  };

  const handleUpdateItemStatus = async (itemId, isChecked) => {
    try {
      await axios.put(`${BASE_URL}/api/items/${userId}/${itemId}`, { is_checked: isChecked });
      handleFetchItems();
    } catch (error) {
      console.error('Error updating item status:', error);
    }
  };

  const handleResetItems = async () => {
    try {
      await axios.put(`${BASE_URL}/api/items/reset/${userId}`);
      handleFetchItems();
    } catch (error) {
      console.error('Error resetting items:', error);
    }
  };

  return (
    <div>
      {/* Difficulty buttons */}
      <DifficultyButtons setDifficulty={setDifficulty} />
      
      {/* Item list */}
      <ItemList items={items} handleUpdateItemStatus={handleUpdateItemStatus} />
      
      {/* Reset button */}
      <ResetButton handleResetItems={handleResetItems} />
    </div>
  );
};

export default App;
