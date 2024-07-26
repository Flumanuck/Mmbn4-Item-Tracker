import React from 'react';
import AreaPanel from './AreaPanel';
import "./ItemList.css"

function ItemList({ items, handleUpdateItemStatus }){
  const groupedItems = items.reduce((acc, item) => {
    if (!acc[item.location]) {
      acc[item.location] = [];
    }
    acc[item.location].push(item);
    return acc;
  }, {});

  return (
    <div className='item-list'>
      {Object.keys(groupedItems).map(areaName => (
        <AreaPanel
          key={areaName}
          areaName={areaName}
          items={groupedItems[areaName]}
          handleUpdateItemStatus={handleUpdateItemStatus}
        />
      ))}
    </div>
  );
};

export default ItemList;
