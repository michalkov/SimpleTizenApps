var weatherView;
var weatherContext;
var weatherObjectArray;
var lastUpdateTime;

function WeatherObject(startX, startY, img, velocity, update, endX, endY)
{
	this.startX = startX;
	this.startY = startY;
	this.currentX = startX;
	this.currentY = startY;
	this.img = img;
	this.velocity = velocity;
	this.update = update;
	this.endX = endX;
	this.endY = endY;
}

//Initialize function
var init = function () {
    // add eventListener for tizenhwkey
    document.addEventListener('tizenhwkey', function(e) {
        if(e.keyName == "back")
            tizen.application.getCurrentApplication().exit();
    });
    
    $("#searchButton").click(function(){
    	getWeather();
    });
    
    weatherObjectArray = new Array();
    
    weatherView = document.getElementById('weather-view');
    
    weatherView.width = window.innerWidth;
    weatherView.height = window.innerHeight;
    
    weatherContext = weatherView.getContext('2d');    
    weatherContext.clearRect(0, 0, weatherView.width, weatherView.height);  
    
    var weatherImage = new Image();
    weatherImage.onload = function() {
    	weatherObjectArray[weatherObjectArray.length]= 
    		new WeatherObject(-this.width, 50, this, 0.1, updateCloud, weatherView.width+this.width, 50 );
        //context.drawImage(imageObj, 69, 50);
      };
    weatherImage.src = 'images/cloud1.png';
    
    var weatherImage2 = new Image();
    weatherImage2.onload = function() {
    	weatherObjectArray[weatherObjectArray.length]= 
    		new WeatherObject(-this.width, 400, this, 0.05, updateCloud, weatherView.width+this.width, 50 );
        //context.drawImage(imageObj, 69, 50);
      };
    weatherImage2.src = 'images/cloud2.png';
    
    
    lastUpdateTime = new Date().getTime();    
    render();
};
window.onload = init;



function updateCloud(context, dt)
{
	var distance = this.velocity * dt;
	this.currentX = this.currentX + distance;
	
	if(this.currentX > this.endX)
		this.currentX = this.startX;
	
	context.drawImage(this.img, this.currentX, this.currentY);
}

var requestAnimationFrame =  
    window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.msRequestAnimationFrame ||
    window.oRequestAnimationFrame ||
    function(callback) {
      return setTimeout(callback, 1);
};

var render = function() {
	
    // Clear the canvas
	weatherContext.clearRect(0, 0, weatherView.width, weatherView.height);

    // Calculate delta time
    var dt = 0;
    var currentTime = new Date().getTime();
    
    dt = currentTime - lastUpdateTime;
    lastUpdateTime = new Date().getTime();
    
    // Update Objects    
    for(var i = 0; i < weatherObjectArray.length; i++){
    	weatherObjectArray[i].update(weatherContext, dt);
    }
    
    
    
    // Redraw
    requestAnimationFrame(render);
};

function getWeather(country, city)
{
	if(country.length == 0)
		showCountryError();
	else if(city.length == 0)
		showCityError();
	else	
		$.getJSON("http://api.wunderground.com/api/2a8066612426bf38/geolookup/conditions/q/"+
			country+"/"+city+".json", showWeather);
	
	// show loading
}

function showWeather(jsonData)
{

}

function showCountryError()
{

}

function showCityError()
{
	
}

function showQueryError()
{

}