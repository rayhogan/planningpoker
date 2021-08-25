import { Story } from '../../Models/IStory';
import React from 'react';
import './ActiveStory.css';

class ActiveStory extends React.Component<Story, any> {
 
  constructor(props:Story) {
    super(props);
    this.state = { };
  }

  render() {
    return (
      <div className="Active-story">
      {this.props.title}
    </div>
    );
  }
}

export default ActiveStory;
