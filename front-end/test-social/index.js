var fbButton = document.getElementById('fb-share-button');
var url =window.location.href;

fbButton.addEventListener('click', function() {
  console.log("que bola"+ fbButton.name);
    window.open('https://www.facebook.com/sharer/sharer.php?u=' + url,
        'facebook-share-dialog',
        'width=600,height=400'
    );
    return false;
});
