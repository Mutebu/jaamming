import React, {useState, useEffect} from 'react';
import './App.css';
import Results from './components/Results.js';
import CreatePlaylistField from './components/CreatePlaylistField.js';
import {onPageLoad, searchSpotify} from './components/SpotifyAPI.js'

function App() {
  const[input, setInput] = useState("");
  const[text, setText] = useState("");
  const [items, setItems] = useState([]);
  const [chosenItems, setChosenItems] = useState([])
  const handleChange = (e) => {
    setInput(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setText(input);
  };

  const addSong = (songId) => {
    const chosenItemById = items[songId];
    if(!chosenItems.some(item => item.id===chosenItemById.id)){
      setChosenItems(prev => {
        const newChosenItems = [chosenItemById, ...prev];
        localStorage.setItem('chosen_items', JSON.stringify(newChosenItems));
        return newChosenItems;
      });
    }
  }

  const deleteSong = (songId) => {
    setChosenItems(prev => {
      const newChosenItems = prev.filter(item => item.id !== songId)
      localStorage.setItem('chosen_items', JSON.stringify(newChosenItems));
      return newChosenItems;
    })
  }

  useEffect(() => {
      async function fetchData(){
          const result = await searchSpotify(text);
          if(result && result.tracks && result.tracks.items){
              setItems(result.tracks.items);
          };
      };
      if(text){
          fetchData();
      }
  }, [text])

  useEffect(() => {
    console.log('choseItems:')
    console.log(chosenItems);
  }, [chosenItems])

  useEffect(() => {
    onPageLoad();
  },[])

  return (
    <div className="App">
      <header className="App-header">
        <nav className="App-nav">
          <h1>Ja<span>mmm</span>ing</h1>
        </nav>
      </header>
      <main className="App-main">
        <form className='App-form' onSubmit={handleSubmit}>
          <input type='text' className='App-input' value={input} onChange={handleChange}/>
          <button className='App-search'>Search</button>
        </form>
        <div className='resultsAndCreatePlaylist'>
          <Results items={items} addSong={addSong}/>
          <CreatePlaylistField chosenItems={chosenItems} deleteSong={deleteSong}/>
        </div>
      </main>
      <footer className="footer">
        <a href="https://www.vecteezy.com/free-photos/music-background" className='link'>Music Background Stock photos by Vecteezy</a>
      </footer>
    </div>
  );
}

export default App;
