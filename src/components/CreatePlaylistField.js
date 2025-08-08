import React, {useEffect} from 'react';
import styles from '../CSSmodules/CreatePlaylistField.module.css';
import { addTracksToPlaylist, onPageLoad, createPlaylist } from './SpotifyAPI.js';

function CreatePlaylistField({chosenItems, deleteSong}) {
  // Remove unused 'text' variable
  const handleChange = (e) => {
    const newText = e.target.textContent;
    localStorage.setItem('playlist_name', newText);
  }
  
  useEffect(() => {
    onPageLoad();
  }, []) // Remove window.location.search dependency

  return (
    <div className={styles.CreatePlaylistField}>
      <h2 className={styles.h2}>Playlist</h2>
      <h3 className={styles.title}>Title:</h3>
      <h3 contentEditable='true' className={styles.EditableHeading} onInput={handleChange} onBlur={handleChange}>Playlist Name</h3>
      <ul className={styles.list}>
        {chosenItems.map((item,itemId) => {
          return(
            <li key={itemId} className={styles.items}>
              <div className={styles.nameAndArtists}>
                <h3 key = {itemId} className={styles.itemsTitle}>{item.name}</h3>
                {item.artists.map((artist, artistId) => {
                  return <h4 key={artistId} className={styles.artists}>{artist.name}</h4>
                })}
              </div>
              <button onClick={() => {deleteSong(item.id)}} className={styles.button}>-</button>
            </li>
          )
        })}
      </ul>
      <button className={styles.createPlaylist} onClick={() => addTracksToPlaylist()}>add</button>
      <button className={styles.createPlaylist} onClick={() => createPlaylist()}>Create</button>
    </div>
  );
}

export default CreatePlaylistField;
