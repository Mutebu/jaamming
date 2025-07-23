import React, {useState} from 'react';
import './App.css';
import Results from './components/Results.js';
import CreatePlaylistField from './components/CreatePlaylistField.js';
import Search from './components/Search.js'

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <nav className="App-nav">
          <h1>Ja<span>mmm</span>ing</h1>
        </nav>
      </header>
      <main className="App-main">
        <Search/>
        <div className='resultsAndCreatePlaylist'>
          <Results/>
          <CreatePlaylistField/>
        </div>
      </main>
      <footer>
        <a href="https://www.vecteezy.com/free-photos/music-background">Music Background Stock photos by Vecteezy</a>
      </footer>
    </div>
  );
}

export default App;
