function getCode(){
  let code = null;
  const queryString = window.location.search;
  if(queryString.length > 0){
    const urlParams = new URLSearchParams(queryString);
    code = urlParams.get('code');
  }
  return code
}

export {getCode};