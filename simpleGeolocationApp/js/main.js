var locationLabel;
var headingLabel;
var informationLabel;
var locationID;
var watchID = -1;

window.onload = function () {
        
    // add eventListener for tizenhwkey
    document.addEventListener('tizenhwkey', function(e) {
        if(e.keyName == "back")
            tizen.application.getCurrentApplication().exit();
    });
    
    locationLabel = $("#location");
    headingLabel = $("#heading");
    informationLabel = $("#information");
    
    informationLabel.text("Calculating current position");
    
    //locationLabel.text("lala");
    //$('#location').html("lala");
    locationID = window.setInterval(getCurrentLocation, 3000);
    
    //getCurrentLocation();
};

function getCurrentLocation(){
	navigator.geolocation.getCurrentPosition(getLocationSuccess, getLocationError);
	
}

function getLocationSuccess(position){
	informationLabel.text("Position acquired");
	locationLabel.text("Latitude "+ position.coords.latitude + " Longitude " + position.coords.longitude );
	headingLabel.text("Heading angle " + position.coords.heading);
	
	if(watchID == -1)
	{
		window.clearInterval(locationID);
		watchID = navigator.geolocation.watchPosition(getLocationSuccess, getLocationError);
	}
}

function getLocationError(error){
	
	if(error.code == 1)
		informationLabel.text("No permission to get postion")
	else if(error.code == 2)
		informationLabel.text("Position not available");
	else if(error.code == 3)
		informationLabel.text("Timeout");
}