import React from 'react';
import "./Item.css"

function Item({ item, handleUpdateItemStatus }){
  const handleClick = () => {
    handleUpdateItemStatus(item.id, !item.is_checked);
  };

  return (
    <div
      onClick={handleClick}
      className={`item ${item.is_checked ? 'checked' : ''}`}
    >
      <img
        src={item.type === 'BMD' ? '/BMD.webp' : '/PMD.webp'}
        alt={item.type}
        className= {`item-icon ${item.is_checked ? "invisible" : ''}`}
      />
      <p>{item.name}</p>
    </div>
  );
};

export default Item;
