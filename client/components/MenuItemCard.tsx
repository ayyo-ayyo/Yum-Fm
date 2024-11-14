import React from 'react';

const MenuItem = ({ menuItemId, menuId, itemName, category, course, fulfilledFilters, price }) => {
  return (
    <div className="menu-item-card">
      <div className="menu-item-header">
        <h2 className="item-name">{itemName}</h2>
        <p className="item-price">${price}</p>
      </div>
      <div className="menu-item-details">
        <p className="item-category">Category: {category}</p>
        <p className="item-course">Course: {course}</p>
        <p className="item-filters">Fulfilled Filters: {fulfilledFilters.join(', ')}</p>
      </div>
    </div>
  );
};

export default MenuItem;