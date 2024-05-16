import React from 'react';
import Item from './Item';
import './AreaPanel.css';

function AreaPanel({ areaName, items, handleUpdateItemStatus }){
  const bmdItems = items.filter(item => item.type === 'BMD');
  const pmdItems = items.filter(item => item.type === 'PMD');

  let formattedName = areaName.replaceAll("_", " "); 

  return (
    <div className="area-panel">
      <h3>{formattedName}</h3>
      <div className="area-items">
        <div className="bmd-items">
          {bmdItems.map(item => (
            <Item key={item.id} item={item} handleUpdateItemStatus={handleUpdateItemStatus} />
          ))}
        </div>
        <div className="pmd-items">
          {pmdItems.map(item => (
            <Item key={item.id} item={item} handleUpdateItemStatus={handleUpdateItemStatus} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default AreaPanel;
