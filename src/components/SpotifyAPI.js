import React from 'react';

const clientId = process.env.REACT_APP_CLIENT_ID;
const clientSecret = process.env.REACT_APP_CLIENT_SECRET;
const playlistEndpoint = "602PyO5kSpgc6D9bGzwozC?si=4BXC_xM_TZaQph35XKle_w";

async function getAccessToken() {
    const response = await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': 'Basic ' + btoa(`${clientId}:${clientSecret}`)
        },
        body: 'grant_type=client_credentials'
    });
    if (response.ok) {
        const data = await response.json();
        return data.access_token;
    }

};

async function searchSpotify(query) {
    const token = await getAccessToken();
    const response = await fetch(`https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=track,artist&limit=50`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
    const result = await response.json();
    console.log(result);
    return result;
};

async function addTracksToPlaylist(tracks){
    
}
    
export {searchSpotify, addTracksToPlaylist};