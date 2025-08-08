import React from 'react';
import { addItemsToPlaylist } from './modules/addItemsToPlaylist';
import { getCode } from './modules/getCode';
import {createPlaylist} from './modules/createPlaylist';

const clientId = process.env.REACT_APP_CLIENT_ID || '502c74e44ce84d9391e7e7d7b2d4a448';
// Temporarily remove client secret to fix build issues
// const clientSecret = process.env.REACT_APP_CLIENT_SECRET;
const redirectUri = process.env.NODE_ENV === 'production' 
  ? `${process.env.REACT_APP_NETLIFY_URL || 'https://mellow-fudge-3dedda.netlify.app'}/callback` 
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
  const clientSecret = process.env.REACT_APP_CLIENT_SECRET;
  let body = new URLSearchParams({
    grant_type:'authorization_code',
    code: code,
    redirect_uri: redirectUri,
    client_id: clientId,
    client_secret: clientSecret
  });
  callAuthorizationApi(body, clientSecret);
}

function callAuthorizationApi(body, clientSecret){
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
    // For client credentials flow, we should handle this server-side
    // For now, let's use the public Web API which doesn't require client secret
    const clientSecret = process.env.REACT_APP_CLIENT_SECRET;
    try {
        const response = await fetch('https://accounts.spotify.com/api/token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': 'Basic ' + btoa(`${clientId}:${clientSecret || ''}`)
            },
            body: 'grant_type=client_credentials'
        });
        if (response.ok) {
            const data = await response.json();
            return data.access_token;
        } else {
            console.error('Failed to get access token:', response.statusText);
            return null;
        }
    } catch (error) {
        console.error('Error getting access token:', error);
        return null;
    }
};

//Getting search response
async function searchSpotify(query) {
    try {
        const token = await getAccessTokenForSearch();
        if (!token) {
            console.error('No access token available for search');
            return null;
        }
        
        const response = await fetch(`https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=track,artist&limit=50`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        if (!response.ok) {
            console.error('Search failed:', response.statusText);
            return null;
        }
        
        const result = await response.json();
        console.log(result);
        return result;
    } catch (error) {
        console.error('Error in searchSpotify:', error);
        return null;
    }
};


    
export {searchSpotify, addTracksToPlaylist, onPageLoad};