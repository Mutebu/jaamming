function getUserPlaylistsEndpoint() {
    const user_profile = JSON.parse(localStorage.getItem('user_profile'));
    console.log('user_profile',user_profile)
    if (!user_profile) {
        throw new Error('User profile not found in localStorage');
    }
    const user_id = user_profile.id;
    console.log(`user_id: ${user_id}`)
    const playlists_endpoint = `https://api.spotify.com/v1/users/${user_id}/playlists`;
    return playlists_endpoint;
}

function handleResponse(){
    if(this.status === 200){
        let data = JSON.parse(this.response);
        console.log(data);
        localStorage.setItem('user_playlists', JSON.stringify(data));
    } else{
        console.log(this.responseText);
        alert(this.responseText);
    }
}

function getUserPlaylists() {
    const playlists_endpoint = getUserPlaylistsEndpoint();
    const access_token = localStorage.getItem('access_token');
    if (!access_token) {
        alert('Access token not found. Please login again.');
        return;
    }
    let xhr = new XMLHttpRequest();
    xhr.open('GET', playlists_endpoint, true);
    xhr.setRequestHeader('Content-type', 'application/json');
    xhr.setRequestHeader('Authorization', `Bearer ${access_token}`);
    xhr.onload = handleResponse;
    xhr.send();
}

export {getUserPlaylists};

