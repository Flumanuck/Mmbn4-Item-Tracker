import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DifficultyButtons from './components/DifficultyButtons.jsx';
import ItemList from './components/ItemList.jsx';
import ResetButton from './components/ResetButton';
import Modal from "./components/Modal";


const BASE_URL = import.meta.env.VITE_BASE_URL;

function App() {
  // Use States
  const [difficulty, setDifficulty] = useState('Normal');
  const [items, setItems] = useState([]); 
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(true);
  const [userId, setUserId] = useState(null);

  // Use Effects
  useEffect(() => {
    if (isLoggedIn) {
      handleFetchItems();
    }
  }, [isLoggedIn, difficulty]);

  // Handler functions
  const handleFetchItems = async () => {
    const token = localStorage.getItem('token');
    const storedUserId = localStorage.getItem('userId');
    if (!token || !storedUserId) return;
    try {
      const response = await axios.get(`${BASE_URL}/api/items/${storedUserId}/${difficulty}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      const data = response.data;
      setItems(Array.isArray(data) ? data : []);
      setUserId(storedUserId);
    } catch (error) {
      console.error('Error fetching items:', error);
      setItems([]); // making sure items is an array
    }
  };

  const handleUpdateItemStatus = async (itemId, isChecked) => {
    const token = localStorage.getItem('token');
    if (!token) return;
    try {
      await axios.put(`${BASE_URL}/api/items/${userId}/${itemId}`, { is_checked: isChecked }, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      handleFetchItems();
    } catch (error) {
      console.error('Error updating item status:', error);
    }
  };

  const handleResetItems = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;
    try {
      await axios.put(`${BASE_URL}/api/items/reset/${userId}`, {}, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      handleFetchItems();
    } catch (error) {
      console.error('Error resetting items:', error);
    }
  };

  const handleLoginSuccess = (token, userId) => {
    localStorage.setItem('token', token);
    localStorage.setItem('userId', userId);
    setUserId(userId);
    setIsLoggedIn(true);
    setIsModalOpen(false);
    handleFetchItems(); 
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div>
      <h1>MMBN4 Mystery Data Tracker</h1>
      <Modal show={isModalOpen} onClose={handleCloseModal} onSuccess={handleLoginSuccess} />
      <DifficultyButtons setDifficulty={setDifficulty} />   
      <ItemList items={items} handleUpdateItemStatus={handleUpdateItemStatus} />
      <ResetButton handleResetItems={handleResetItems} />
    </div>
  );
}

export default App;
