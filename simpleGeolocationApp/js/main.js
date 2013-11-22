var latitudeLabel;
var longitudeLabel;
var informationLabel;
var locationID;
var watchID = -1;

window.onload = function () {
        
    // add eventListener for tizenhwkey
    document.addEventListener('tizenhwkey', function(e) {
        if(e.keyName == "back")
            tizen.application.getCurrentApplication().exit();
    });
    
    latitudeLabel = $("#latitude");
    longitudeLabel = $("#longitude");
    informationLabel = $("#information");
    
    informationLabel.text("Calculating position");
	latitudeLabel.text("Latitude: N/A");
	longitudeLabel.text("Longitude: N/A");
	
    locationID = window.setInterval(getCurrentLocation, 3000);
    
};

function getCurrentLocation(){
	navigator.geolocation.getCurrentPosition(getLocationSuccess, getLocationError);
}

function getLocationSuccess(position){
	informationLabel.text("Position acquired");
	
	latitudeLabel.text("Latitude: "+ position.coords.latitude.toFixed(5));
	longitudeLabel.text("Longitude: " + position.coords.longitude.toFixed(5));
	
	if(watchID == -1)
	{
		window.clearInterval(locationID);
		watchID = navigator.geolocation.watchPosition(getLocationSuccess, getLocationError);
	}
}

function getLocationError(error){
	
	latitudeLabel.text("Latitude: N/A");
	longitudeLabel.text("Longitude: N/A");
	
	if(error.code == 1)
		informationLabel.text("No permission to get postion")
	else if(error.code == 2)
		informationLabel.text("Position not available");
	else if(error.code == 3)
		informationLabel.text("Timeout");
}