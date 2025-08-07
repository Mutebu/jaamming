import React from 'react';
import {getUserProfile} from './modules/getUserProfile';
import { getUserPlaylists } from './modules/getUserPlaylists';
import { addItemsToPlaylist } from './modules/addItemsToPlaylist';

const clientId = process.env.REACT_APP_CLIENT_ID;
const clientSecret = process.env.REACT_APP_CLIENT_SECRET;
const redirectUri = 'http://127.0.0.1:3000/callback';
const scopes = [
  'playlist-modify-private',
  'playlist-modify-public',
  'playlist-read-private'
];

const AUTHORIZE = 'https://accounts.spotify.com/authorize'
const TOKEN = 'https://accounts.spotify.com/api/token'

let isProcessingCode = false

function onPageLoad(){
  if(window.location.search.length>0 && !isProcessingCode){
    isProcessingCode = true;
    handleRedirect();
  }

}

function handleRedirect(){
  let code = getCode();
  fetchAccessToken(code);
}

function fetchAccessToken(code){
  let body = new URLSearchParams({
    grant_type:'authorization_code',
    code: code,
    redirect_uri: redirectUri,
    client_id: clientId,
    client_secret: clientSecret
  });
  callAuthorizationApi(body);
}

function callAuthorizationApi(body){
  let xhr = new XMLHttpRequest();
  xhr.open('POST', TOKEN, true);
  xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
  xhr.setRequestHeader('Authorization', `Basic ${btoa(`${clientId}:${clientSecret}`)}`)
  xhr.send(body);
  xhr.onload = handleAuthorizationResponse;
}

function handleAuthorizationResponse(){
  if (this.status == 200){
    let data = JSON.parse(this.responseText);
    console.log(data);
    if(data.access_token != undefined){
      let access_token=data.access_token;
      localStorage.setItem('access_token', access_token);
      console.log(access_token);
      window.history.replaceState({}, document.title, "/");
      getUserProfile();
      getUserPlaylists();
      addItemsToPlaylist();
    }
  }else{
    console.log(this.responseText);
    alert(this.responseText);
  }
  isProcessingCode = false;
}

function getCode(){
  let code = null;
  const queryString = window.location.search;
  if(queryString.length > 0){
    const urlParams = new URLSearchParams(queryString);
    code = urlParams.get('code');
  }
  return code
}

function requestAuthorization(){
  let url = AUTHORIZE;
  let urlEndpoint = new URLSearchParams({
    client_id: clientId,
    response_type: "code",
    redirect_uri: encodeURI(redirectUri),
    show_dialogue: true,
    scope: scopes.join(' ')
  })
  url+= `/?${urlEndpoint}`;
  window.location.href = url;
}

async function getAccessTokenForSearch() {
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
    const token = await getAccessTokenForSearch();
    const response = await fetch(`https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=track,artist&limit=50`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
    const result = await response.json();
    console.log(result);
    return result;
};

async function addTracksToPlaylist() {
  requestAuthorization();
}

    
export {searchSpotify, addTracksToPlaylist, onPageLoad};