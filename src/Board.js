import React from 'react';
import Dragula from 'dragula';
import 'dragula/dist/dragula.css';
import Swimlane from './Swimlane';
import './Board.css';

export default class Board extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      clients: {
        backlog: [],
        inProgress: [],
        complete: []
      },
      backendStatus: 'Checking connection...'
    };
    this.swimlanes = {
      backlog: React.createRef(),
      inProgress: React.createRef(),
      complete: React.createRef(),
    };
  }

  componentDidMount() {
    fetch('http://localhost:3001/api/v1/clients')
      .then(res => {
        if (!res.ok) throw new Error('Backend not OK');
        return res.json();
      })
      .then(data => {
        this.setState({ backendStatus: 'Connected ✅ (Backend chal raha hai)' });

        const backlog = data.filter(c => c.status === 'backlog' || !c.status)
                            .sort((a, b) => (a.priority || 999) - (b.priority || 999));
        const inProgress = data.filter(c => c.status === 'in-progress')
                               .sort((a, b) => (a.priority || 999) - (b.priority || 999));
        const complete = data.filter(c => c.status === 'complete')
                             .sort((a, b) => (a.priority || 999) - (b.priority || 999));

        this.setState({ clients: { backlog, inProgress, complete } });
      })
      .catch(err => {
        console.error('Backend load failed:', err);
        this.setState({ backendStatus: 'Not Connected ❌ (Backend band hai ya error hai)' });

        const local = this.getClients();
        this.setState({
          clients: {
            backlog: local.filter(c => c.status === 'backlog'),
            inProgress: local.filter(c => c.status === 'in-progress'),
            complete: local.filter(c => c.status === 'complete'),
          }
        });
      });

    const containers = [
      this.swimlanes.backlog.current,
      this.swimlanes.inProgress.current,
      this.swimlanes.complete.current
    ].filter(c => c);

    if (containers.length < 3) return;

    this.drake = Dragula(containers, {
      moves: (el) => el && el.classList.contains('Card')
    });

    this.drake.on('drop', (el, target, source, sibling) => {
      if (!target) return;

      this.drake.cancel(true);

      const clientId = el.getAttribute('data-id');
      const newSwimlane = target.closest('.Swimlane-column') || target;
      const newStatus = newSwimlane.getAttribute('data-status');
      const oldSwimlane = source.closest('.Swimlane-column') || source;
      const oldStatus = oldSwimlane.getAttribute('data-status');

      if (!clientId || !newStatus) return;

      console.log('Card moved to:', newStatus, 'ID:', clientId);

      // Calculate new priority based on drop position
      let cards = Array.from(target.children);
      let newPriority = cards.length; // lowest by default

      if (sibling) {
        const siblingIndex = cards.indexOf(sibling);
        newPriority = siblingIndex + 1; // Insert before sibling, shift priorities
      }

      // Frontend state update for immediate feedback
      this.setState(prevState => {
        let allClients = [
          ...prevState.clients.backlog,
          ...prevState.clients.inProgress,
          ...prevState.clients.complete
        ];

        const clientIndex = allClients.findIndex(c => c.id === clientId);
        if (clientIndex === -1) return prevState;

        const client = { ...allClients[clientIndex] };
        client.status = newStatus;

        allClients = allClients.filter(c => c.id !== clientId);

        const newIndex = sibling ? cards.indexOf(sibling) : cards.length;
        allClients.splice(newIndex, 0, client);

        return {
          clients: {
            backlog: allClients.filter(c => c.status === 'backlog' || !c.status),
            inProgress: allClients.filter(c => c.status === 'in-progress'),
            complete: allClients.filter(c => c.status === 'complete'),
          }
        };
      });

      // Backend save with status and priority
      fetch(`http://localhost:3001/api/v1/clients/${clientId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus, priority: newPriority })
      })
      .then(res => {
        if (!res.ok) throw new Error('Save failed');
        return res.json();
      })
      .then(updatedClients => {
        console.log('Saved to backend!', updatedClients);

        // Update state with updatedClients from backend
        const backlog = updatedClients.filter(c => c.status === 'backlog' || !c.status)
                                      .sort((a, b) => (a.priority || 999) - (b.priority || 999));
        const inProgress = updatedClients.filter(c => c.status === 'in-progress')
                                         .sort((a, b) => (a.priority || 999) - (b.priority || 999));
        const complete = updatedClients.filter(c => c.status === 'complete')
                                       .sort((a, b) => (a.priority || 999) - (b.priority || 999));

        this.setState({ clients: { backlog, inProgress, complete } });
      })
      .catch(err => console.error('Save failed:', err));
    });
  }

  componentWillUnmount() {
    if (this.drake) this.drake.destroy();
  }

  getClients() {
    return [
      ['1','Stark, White and Abbott','Cloned Optimal Architecture', 'in-progress'],
      ['2','Wiza LLC','Exclusive Bandwidth-Monitored Implementation', 'complete'],
      ['3','Nolan LLC','Vision-Oriented 4Thgeneration Graphicaluserinterface', 'backlog'],
      ['4','Thompson PLC','Streamlined Regional Knowledgeuser', 'in-progress'],
      ['5','Walker-Williamson','Team-Oriented 6Thgeneration Matrix', 'in-progress'],
      ['6','Boehm and Sons','Automated Systematic Paradigm', 'backlog'],
      ['7','Runolfsson, Hegmann and Block','Integrated Transitional Strategy', 'backlog'],
      ['8','Schumm-Labadie','Operative Heuristic Challenge', 'backlog'],
      ['9','Kohler Group','Re-Contextualized Multi-Tasking Attitude', 'backlog'],
      ['10','Romaguera Inc','Managed Foreground Toolset', 'backlog'],
      ['11','Reilly-King','Future-Proofed Interactive Toolset', 'complete'],
      ['12','Emard, Champlin and Runolfsdottir','Devolved Needs-Based Capability', 'backlog'],
      ['13','Fritsch, Cronin and Wolff','Open-Source 3Rdgeneration Website', 'complete'],
      ['14','Borer LLC','Profit-Focused Incremental Orchestration', 'backlog'],
      ['15','Emmerich-Ankunding','User-Centric Stable Extranet', 'in-progress'],
      ['16','Willms-Abbott','Progressive Bandwidth-Monitored Access', 'in-progress'],
      ['17','Brekke PLC','Intuitive User-Facing Customerloyalty', 'complete'],
      ['18','Bins, Toy and Klocko','Integrated Assymetric Software', 'backlog'],
      ['19','Hodkiewicz-Hayes','Programmable Systematic Securedline', 'backlog'],
      ['20','Murphy, Lang and Ferry','Organized Explicit Access', 'backlog'],
    ].map(companyDetails => ({
      id: companyDetails[0],
      name: companyDetails[1],
      description: companyDetails[2],
      status: companyDetails[3] || 'backlog',
    }));
  }

  renderSwimlane(name, clients, ref, status) {
    return (
      <Swimlane name={name} clients={clients} dragulaRef={ref} status={status} />
    );
  }

  render() {
    return (
      <div className="Board">
        <div style={{ textAlign: 'center', margin: '10px', fontWeight: 'bold', color: this.state.backendStatus.includes('Connected') ? 'green' : 'red' }}>
          {this.state.backendStatus}
        </div>
        <div className="container-fluid">
          <div className="row">
            <div className="col-md-4 Swimlane-column" data-status="backlog">
              {this.renderSwimlane('Backlog', this.state.clients.backlog, this.swimlanes.backlog, 'backlog')}
            </div>
            <div className="col-md-4 Swimlane-column" data-status="in-progress">
              {this.renderSwimlane('In Progress', this.state.clients.inProgress, this.swimlanes.inProgress, 'in-progress')}
            </div>
            <div className="col-md-4 Swimlane-column" data-status="complete">
              {this.renderSwimlane('Complete', this.state.clients.complete, this.swimlanes.complete, 'complete')}
            </div>
          </div>
        </div>
      </div>
    );
  }
}