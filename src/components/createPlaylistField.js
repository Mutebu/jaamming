import React from 'react';
import styles from '../CSSmodules/CreatePlaylistField.module.css';

function CreatePlaylistField({ onChange, value }) {
  return (
    <div className={styles.CreatePlaylistField}>
      <h2 contenteditable = 'true'className={styles.EditableHeading}></h2>
    </div>
  );
}

export default CreatePlaylistField;
