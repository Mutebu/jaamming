import { getUserProfile } from "./getUserProfile";

function getUserPlaylistsEndpoint(){
    getUserProfile();
    const user_profile = JSON.parse(localStorage.getItem('user_profile'));
    console.log('user_profile',user_profile)
    if (!user_profile) {
        throw new Error('User profile not found in localStorage');
    }
    const user_id = user_profile.id;
    const playlists_endpoint = `https://api.spotify.com/v1/users/${user_id}/playlists`;
    return playlists_endpoint;
}

function handleResponse(){
    if (this.status ===201){
        console.log('success');
    }
}

function createPlaylist(){
    const playlists_endpoint = getUserPlaylistsEndpoint();
    const access_token = localStorage.getItem('access_token');
    let nameOfPlaylist = localStorage.getItem('playlist_name');
    console.log(nameOfPlaylist)
    // Remove unused variables since they're not used in this function
    let body = {
        name: nameOfPlaylist,
        description: "won",
        public: true
    }
    let xhr = new XMLHttpRequest();
    xhr.open('POST', playlists_endpoint);
    xhr.setRequestHeader('Content-type', 'application/json');
    xhr.setRequestHeader('Authorization', `Bearer ${access_token}`);
    xhr.onload = handleResponse;
    xhr.send(JSON.stringify(body))
}

export {createPlaylist};