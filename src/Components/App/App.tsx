import logo from './Assets/logo.svg';
import './App.css';
import Login from '../Login/Login';

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
    </div>
  );
}

export default App;
