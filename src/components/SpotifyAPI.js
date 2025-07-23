import React from 'react';

const clientId = '502c74e44ce84d9391e7e7d7b2d4a448';
const clientSecret = '568e1208ad784f0eb0c68253a8549413';

function SpotifyAPI(text) {
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
        const response = await fetch(`https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=track`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        const result = await response.json();
        console.log(result);
    };

    searchSpotify(text);
}

export default SpotifyAPI;