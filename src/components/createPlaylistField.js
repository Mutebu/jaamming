import React from 'react';
import styles from './CSSmodules/createPlaylistField.module.css';

function CreatePlaylistField({ onChange, value }) {
  return (
    <div className={styles.CreatePlaylistField}>
      <h2 contenteditable="true"></h2>
    </div>
  );
}

export default CreatePlaylistField;
