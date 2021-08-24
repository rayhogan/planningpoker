import logo from './Assets/logo.svg';
import './App.css';
import Login from '../Login/Login';
import ActiveStory from '../ActiveStory/ActiveStory';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <p>
          StorySizing.io
        </p>
      </header>
      <div>
        <Login />
      </div>
      <div>
        <ActiveStory title="As a User, I want X, or that Y" />
      </div>
    </div>
  );
}

export default App;
