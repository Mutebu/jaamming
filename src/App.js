import './App.css';
import Results from './components/Results.js';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <nav className="App-nav">
          <h1>Ja<span>mmm</span>ing</h1>
        </nav>
      </header>
      <main className="App-main">
        <form className='App-form'>
          <input type='text' className='App-input'/>
          <button className='App-search'>Search</button>
        </form>
        <div>
          <Results/>
        </div>
      </main>
      <footer>
        <a href="https://www.vecteezy.com/free-photos/music-background">Music Background Stock photos by Vecteezy</a>
      </footer>
    </div>
  );
}

export default App;
