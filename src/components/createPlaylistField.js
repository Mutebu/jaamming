import React from 'react';
import styles from '../CSSmodules/CreatePlaylistField.module.css';

function CreatePlaylistField({chosenItems, deleteSong}) {
  return (
    <div className={styles.CreatePlaylistField}>
      <h2 className={styles.h2}>Playlist</h2>
      <h3 className={styles.title}>Title:</h3>
      <h3 contenteditable = 'true'className={styles.EditableHeading}></h3>
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
      <button className={styles.createPlaylist}>Create</button>
    </div>
  );
}

export default CreatePlaylistField;
