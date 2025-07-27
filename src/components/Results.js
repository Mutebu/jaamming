import React from 'react';
import styles from '../CSSmodules/Results.module.css';

function Results({items, addSong}){
    if(items){
        return(
            <div className={styles.Results}>
                <h2 className={styles.h2}>Results</h2>
                <ul className={styles.list}>
                    {items.map((item,itemId) => {
                        return(
                            <li key={itemId} className={styles.items}>
                                <div className={styles.nameAndArtists}>
                                    <h3 className={styles.itemsTitle}>{item.name}</h3>
                                    {item.artists.map((artist,artistId) => {
                                        return(
                                            <h4 key={artistId} className={styles.artists}>{artist.name}</h4>
                                        )
                                    })}
                                </div>
                                <button onClick={()=>addSong(itemId)} className={styles.button}>+</button>
                            </li>
                        );
                    })}
                </ul>
            </div>
        )
    }
}

export default Results;