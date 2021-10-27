import './App.css';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Login from './Login/Login';
import StoryBacklog from './StoryBacklog/StoryBacklog';
import ActiveStory from './ActiveStory/ActiveStory';
import VotingControls from './VotingControls/VotingControls';
import AdminControls from './AdminControls/AdminControls';
import ConnectedUsers from './ConnectedUsers/ConnectedUsers';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Box from '@material-ui/core/Box';
import Footer from './Footer/Footer';


function App() {
  return (
    <div className="App">
      <header className="App-header">
        <p>
          StorySizing.io
        </p>
      </header>
      <div>
        {/* <Login /> */}
      </div>
      <div>
        <ActiveStory title="As a User, I want X, so that Y" />
      </div>
      <div>
        <VotingControls />
      </div>
      <div>
        <AdminControls />
      </div>
      <div className="Info-Area">
        <div className="Info-Panel">
          <Grid container spacing={3}>
            <Grid item xs={3}>
              <ConnectedUsers />
            </Grid>
            <Grid item xs={9}>
              <StoryBacklog />
            </Grid>
          </Grid>
        </div>
      </div>
      <div className="Footer">
        <Footer/>
      </div>
    </div>
  );
}

export default App;
