import React from 'react';

export default class Card extends React.Component {
  render() {
    const { id, name, description, status } = this.props;
    const cardClasses = ['Card', status || 'backlog'].join(' ');

    return (
      <div 
        className={cardClasses}
        data-id={id}
        data-status={status}
      >
        <div className="Card-title">{name}</div>
        {description && (
          <div className="Card-description">{description}</div>
        )}
      </div>
    );
  }
}
