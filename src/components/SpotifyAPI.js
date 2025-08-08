import React from 'react';
import { addItemsToPlaylist } from './modules/addItemsToPlaylist';
import { getCode } from './modules/getCode';
import {createPlaylist} from './modules/createPlaylist';

const clientId = process.env.REACT_APP_CLIENT_ID;
const clientSecret = process.env.REACT_APP_CLIENT_SECRET;
const redirectUri = process.env.NODE_ENV === 'production' 
  ? `${process.env.REACT_APP_NETLIFY_URL}/callback` 
  : 'http://127.0.0.1:3000/callback';
const scopes = [
  'playlist-modify-private',
  'playlist-modify-public',
  'playlist-read-private'
];

const AUTHORIZE = 'https://accounts.spotify.com/authorize'
const TOKEN = 'https://accounts.spotify.com/api/token'


//Page loads

//Getting code from window.location.search
let isProcessingCode = false

function onPageLoad(){
  if(window.location.search.length>0 && !isProcessingCode){
    isProcessingCode = true;
    handleRedirect();
  }

}

function handleRedirect(){
  let code = getCode();
  localStorage.setItem('code', code);
  fetchAccessToken(code);
}





//Authorization

//ACCESS TOKEN
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
      let expires_in = Date.now() + data.expires_in*1000;
      localStorage.setItem('access_token', access_token);
      localStorage.setItem('expires_in', expires_in);
      console.log(access_token);
      window.history.replaceState({}, document.title, "/");
      addItemsToPlaylist();
    }
  }else{
    console.log(this.responseText);
    alert(this.responseText);
  }
  isProcessingCode = false;
}





//ADD

//Adding tracks to playlist
async function addTracksToPlaylist() {
  if (localStorage.getItem('code') === null){
    requestAuthorization();
  }else{
    const expires_in = localStorage.getItem('expires_in');
    if(Date.now() > expires_in){
      requestAuthorization();
    }else{
      addItemsToPlaylist();
    }
  }
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

//CREATE
//Creating playlist
function CreatingPlaylist(){
  if (localStorage.getItem('code') === null){
    requestAuthorization();
  }else{
    const expires_in = localStorage.getItem('expires_in');
    if(Date.now() > expires_in){
      requestAuthorization();
    }else{
      createPlaylist();
    }
  }
}



//SEARCH
//Handling search api


//Getting access token for search
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

//Getting search response
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


    
export {searchSpotify, addTracksToPlaylist, onPageLoad};