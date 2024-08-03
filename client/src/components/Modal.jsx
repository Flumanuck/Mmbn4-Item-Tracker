import React, { useRef, useEffect, useState } from 'react';

const BASE_URL = import.meta.env.VITE_BASE_URL;

const Modal = ({ show, onClose, onSuccess }) => {
  const dialogRef = useRef(null);
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    if (show) {
      dialogRef.current.showModal();
    } else {
      dialogRef.current.close();
    }
  }, [show]);

  const toggleForm = () => {
    setIsLogin(!isLogin);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const url = isLogin ? `${BASE_URL}/login` : `${BASE_URL}/register`;
    const payload = { username, password };

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      if (response.ok) {
        onSuccess(data.token, data.userId);
        onClose();
      } else {
        alert(data.error || 'Something went wrong');
      }
    } catch (error) {
      alert('Error: ' + error.message);
    }
  };

  return (
    <dialog ref={dialogRef} id="modal">
      <div className="modal-content">
        <span className="close" onClick={onClose}>&times;</span>
        <h2>{isLogin ? 'Login' : 'Register'}</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />
          <button type="submit">{isLogin ? 'Login' : 'Register'}</button>
        </form>
        <button onClick={toggleForm}>
          {isLogin ? 'Register here!' : 'Login here!'}
        </button>
      </div>
    </dialog>
  );
};

export default Modal;
