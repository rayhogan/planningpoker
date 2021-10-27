import './Footer.css';
import github from '../../Images/github.svg';

function App() {
  return (
    <div className="Footer-Panel">
      <a href="https://github.com/rayhogan/planningpoker" target="_blank">
        <img src={github} alt="githublogo"/>
      </a>
    </div >
  );
}

export default App;
