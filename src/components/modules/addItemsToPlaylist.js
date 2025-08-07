import { getUserPlaylists } from "./getUserPlaylists";

function getPlaylistEndpoint() {
    getUserPlaylists();
    const playlists = JSON.parse(localStorage.getItem('user_playlists'));
    const playlist_id = playlists.items[0].id;
    const playlist_endpoint = `https://api.spotify.com/v1/playlists/${playlist_id}/tracks`
    return playlist_endpoint;
}

function handleResponse() {
    if (this.status === 201){
        let data = JSON.parse(this.responseText);
        localStorage.removeItem('chosen_items');
    }
}

function addItemsToPlaylist() {
    const chosen_items = localStorage.getItem('chosen_items');
    const parsed_items = JSON.parse(chosen_items);
    const uris = parsed_items.map((item) => item.uri);
    const body = {
        uris: uris
    }
    const access_token = localStorage.getItem('access_token');
    const endpoint = getPlaylistEndpoint();
    let xhr = new XMLHttpRequest();
    xhr.open("POST", endpoint);
    xhr.setRequestHeader('Content-type', 'application/json');
    xhr.setRequestHeader('Authorization', `Bearer ${access_token}`);
    xhr.send(JSON.stringify(body));
    xhr.onload = handleResponse;
}

export {addItemsToPlaylist};