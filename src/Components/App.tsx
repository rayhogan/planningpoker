import './App.css';
import Login from './Login/Login';
import ActiveStory from './ActiveStory/ActiveStory';
import VotingControls from './VotingControls/VotingControls';
import AdminControls from './AdminControls/AdminControls';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <p>
          StorySizing.io
        </p>
      </header>
      <div>
        <Login/>
      </div>
      <div>
        <ActiveStory title="As a User, I want X, so that Y" />
      </div>
      <div>
         <VotingControls/>
      </div>
      <div>
        <AdminControls/>
      </div>
    </div>
  );
}

export default App;
