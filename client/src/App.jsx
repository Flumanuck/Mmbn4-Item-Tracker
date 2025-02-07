import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DifficultyButtons from './components/DifficultyButtons.jsx';
import ItemList from './components/ItemList.jsx';
import ResetButton from './components/ResetButton';
import Modal from "./components/Modal";
import Header from './components/Header.jsx';
import LogoutButton from './components/LogoutButton.jsx';
import refreshToken from './refreshToken'; // Import the refreshToken function
import "./App.css"

const BASE_URL = import.meta.env.VITE_BASE_URL;

function App() {
  const [difficulty, setDifficulty] = useState('Normal');
  const [items, setItems] = useState([]); 
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(true);
  const [userId, setUserId] = useState(null);

  // **Refresh Token on Page Load**
  useEffect(() => {
    const handleInitialLoad = async () => {
      const token = localStorage.getItem('token');
      const storedUserId = localStorage.getItem('userId');
      
      if (token && storedUserId) {
        try {
          await handleTokenRefresh(); // Attempt to refresh token
          setUserId(storedUserId);
          setIsLoggedIn(true);
          setIsModalOpen(false);
          handleFetchItems(); // Fetch items only after successful token refresh
        } catch (error) {
          console.error('Error refreshing token on load:', error);
          handleLogout(); // Log out if refresh fails
        }
      }
    };

    handleInitialLoad();
  }, []);

  // **Trigger Item Fetch When Difficulty Changes**
  useEffect(() => {
    if (isLoggedIn) {
      handleFetchItems();
    }
  }, [difficulty, isLoggedIn]);

  // **Auto Refresh Token Every 15 Minutes**
  useEffect(() => {
    if (isLoggedIn) {
      const interval = setInterval(() => {
        handleTokenRefresh();
      }, 15 * 60 * 1000); // Refresh every 15 minutes
      return () => clearInterval(interval);
    }
  }, [isLoggedIn]);

  // **Functions**
  const handleTokenRefresh = async () => {
    try {
      await refreshToken(); 
    } catch (error) {
      console.error('Error refreshing token:', error);
      throw error;
    }
  };

  const handleFetchItems = async () => {
    const token = localStorage.getItem('token');
    const storedUserId = localStorage.getItem('userId');
    if (!token || !storedUserId) return;

    try {
      const response = await axios.get(`${BASE_URL}/api/items/${storedUserId}/${difficulty}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setItems(response.data || []);
    } catch (error) {
      console.error('Error fetching items:', error);
      setItems([]);
    }
  };

  const handleUpdateItemStatus = async (itemId, isChecked) => {
    const token = localStorage.getItem('token');
    if (!token) return;
    try {
      await axios.put(`${BASE_URL}/api/items/${userId}/${itemId}`, { is_checked: isChecked }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
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
          Authorization: `Bearer ${token}`
        }
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

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    setIsLoggedIn(false);
    setUserId(null);
    setItems([]);
    setIsModalOpen(true);
  };

  // **Render UI**
  return (
    <div>
      <Header/>
      <Modal show={isModalOpen} onClose={handleCloseModal} onSuccess={handleLoginSuccess} />
      <DifficultyButtons setDifficulty={setDifficulty} difficulty={difficulty}/>   
      <ItemList items={items} handleUpdateItemStatus={handleUpdateItemStatus} />
      <div className='row'>
        <ResetButton handleResetItems={handleResetItems} />
        <LogoutButton handleLogout={handleLogout}/>
      </div>
    </div>
  );
}

export default App;
