import React from 'react';

const Card = ({
  children,
  className = '',
  hover = false,
  ...props
}) => {
  return (
    <div
      className={`glass-panel rounded-2xl p-6 ${
        hover ? 'glass-panel-hover' : ''
      } ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;
