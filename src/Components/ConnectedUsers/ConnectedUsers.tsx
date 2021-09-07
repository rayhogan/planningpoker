import './ConnectedUsers.css';
import Avatar from '@material-ui/core/Avatar';
import React from 'react';


class ConnectedUsers extends React.Component {


  render() {
    return (
      <fieldset className="Paper">
        <legend>Connected Users</legend>

        <div className="Users-container">
          <div className="Left">
            <Avatar alt="Ray Hogan" className="small" src="/broken-image.jpg" />
          </div>
          <div className="Right">Ray Hogan</div>
        </div>

        <div className="Users-container">
          <div className="Left">
            <Avatar alt="James" className="small" src="/broken-image.jpg" />
          </div>
          <div className="Right">James</div>
        </div>

        <div className="Users-container">
          <div className="Left">
            <Avatar alt="Pamela" className="small" src="/broken-image.jpg" />
          </div>
          <div className="Right">Pamela</div>
        </div>

      </fieldset>


    );
  }
}

export default ConnectedUsers;
