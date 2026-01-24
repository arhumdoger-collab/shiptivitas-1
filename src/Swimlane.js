import React from 'react';
import Card from './Card';
import './Swimlane.css';

export default class Swimlane extends React.Component {
  render() {
    const { name, clients, dragulaRef, status } = this.props; // status prop Board se aayega (optional)

    const cards = clients.map(client => {
      return (
        <Card
          key={client.id}
          id={client.id}
          name={client.name}
          description={client.description}
          status={client.status}          // Yeh status Card ko bhej rahe hain (color ke liye)
        />
      );
    });

    return (
      <div 
        className="Swimlane-column"
        data-status={status || 'backlog'} // Yeh Board.js ke drop event ke liye zaroori hai
      >
        <div className="Swimlane-title">{name}</div>
        <div 
          className="Swimlane-dragColumn" 
          ref={dragulaRef}
        >
          {cards}
        </div>
      </div>
    );
  }
}
