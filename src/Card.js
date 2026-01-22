import React from 'react';
import './Card.css';

export default class Card extends React.Component {
  render() {
    const { id, name, description, status } = this.props;

    // Class names status ke hisab se (CSS mein .Card.backlog, .Card.in-progress etc. use karenge)
    const cardClasses = ['Card', status || 'backlog'].join(' ');

    return (
      <div 
        className={cardClasses}
        data-id={id}              // Dragula ID ke liye (already tha, good)
        data-status={status}      // Optional, debugging ke liye helpful
      >
        <div className="Card-title">{name}</div>
        {description && (
          <div className="Card-description">{description}</div>
        )}
      </div>
    );
  }
}