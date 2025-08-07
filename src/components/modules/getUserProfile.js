const USER = 'https://api.spotify.com/v1/me'

function getUserProfile(){
  const access_token = localStorage.getItem('access_token')

  if(!access_token){
    console.log('No access token found');
    return;
  }
  let xhr = new XMLHttpRequest();
  xhr.open('GET', USER, true);
  xhr.setRequestHeader('Content-type', 'application/json');
  xhr.setRequestHeader('Authorization', `Bearer ${access_token}`);
  xhr.send()
  xhr.onload = handleGetUserProfileResponse;
};

function handleGetUserProfileResponse(){
  if (this.status == 200) {
    const userProfile = JSON.parse(this.responseText);
    console.log('User profile', userProfile);
    localStorage.setItem('user_profile', JSON.stringify(userProfile));
  } else{
    console.error('Failed to get user profile:', this.responseText);
  }
}

export {getUserProfile};