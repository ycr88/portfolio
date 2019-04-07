var fbButton = document.getElementById('fb-share-button');
var vkButton= document.getElementById('vk-share-button');
var url =window.location.href;

fbButton.addEventListener('click', function() {
      window.open('https://www.facebook.com/sharer/sharer.php?u=' + url,
        'facebook-share-dialog',
        'width=600,height=400'
    );
      return false;
});
  vkButton.addEventListener('click', function() {
     window.open('http://vk.com/share.php?url=' + url,"",'width=600,height=400');             
  return false; 
  });     


