import React, {useState} from 'react';
import SpotifyAPI from './SpotifyAPI';

function Search(){
    const [text, setText] = useState('');
    const handleChange = (e) => {
        setText(e.target.value);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        SpotifyAPI(text);
    };
    return (
        <form className='App-form' onSubmit={handleSubmit}>
            <input type='text' className='App-input' value={text} onChange={handleChange}/>
            <button className='App-search'>Search</button>
        </form>
    );
};

export default Search;