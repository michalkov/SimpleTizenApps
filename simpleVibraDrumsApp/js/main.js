//Initialize function
var init = function () {
    // TODO:: Do your initialization job
    console.log("init() called");

    // add eventListener for tizenhwkey
    document.addEventListener('tizenhwkey', function(e) {
        if(e.keyName == "back")
            tizen.application.getCurrentApplication().exit();
    });
    
    $("#drum-ride-cymbal").click(function() {
    	var audio = document.getElementById('drum-ride-audio');
    	audio.currentTime= 0;
    	audio.play();
    });
    
    $("#drum-crash-cymbal").click(function() {
    	var audio = document.getElementById('drum-crash-audio');
    	audio.currentTime= 0;
    	audio.play();
    });
    
    $("#drum-high-tomtom").click(function() {
    	var audio = document.getElementById('drum-tomtom-audio');
    	audio.currentTime= 0;
    	audio.play();
    });
    
    $("#drum-high-tomtom2").click(function() {
    	var audio = document.getElementById('drum-tomtom-audio');
    	audio.currentTime= 0;
    	audio.play();
    });
    
    $("#drum-bass-drum").click(function() {
    	var audio = document.getElementById('drum-bass-audio');
    	audio.currentTime= 0;
    	audio.play();
    });
};
// window.onload can work without <body onload="">
window.onload = init;

