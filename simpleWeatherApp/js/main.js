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
    
    var searchButton = document.getElementById('searchButton');
    
    searchButton.addEventListener('touchstart', function(){
  		$("#searchButton").toggleClass("active");
  	}, false);
    searchButton.addEventListener('touchend', function(){
    	$("#searchButton").toggleClass("active");
    	getWeather($("#countryInput").val(), $("#cityInput").val());
  	}, false);
    
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
	clearErrors();
	
	if(!country || country.length == 0)
		showCountryError();
	else if(!city || city.length == 0)
		showCityError();
	else{
		var url = "http://api.wunderground.com/api/2a8066612426bf38/geolookup/conditions/q/"+
			country+"/"+city+".json";
		$.ajax({
			type: 'GET',
		    url: url,
		    async: true,
		    contentType: "application/json",
		    dataType: 'jsonp',
		    success: showWeather,
		    error: showQueryError,
		    timeout: 8000
		});
		$("#content").empty();
		showLoader();
	}
	
	// show loading
}

function showWeather(jsonData)
{
	$("#content").empty();
	console.log(jsonData);
	console.log(jsonData.error);
	// należy sprawdzić co tam w środku jest
	if(jsonData.response.error != undefined || jsonData.current_observation == undefined){
		$("#content").append("<p class=\"inputError\">Can't find weather for you.</p>");
	}
	else {
		$("#content").append("<p id=\"title\">Weather for now</p>")
		$("#content").append("<p class=\"weatherInfo\">Country: "+jsonData.location.country_name+"</p>");
		$("#content").append("<p class=\"weatherInfo\">City: "+jsonData.location.city+"</p>");
		$("#content").append("<p class=\"weatherInfo\">Temperature: "+jsonData.current_observation.temp_c+" &deg;C</p>");
		$("#content").append("<p class=\"weatherInfo\">Weather: "+jsonData.current_observation.weather+"</p>");
		$("#content").append("<p class=\"weatherInfo\">Humidity: "+jsonData.current_observation.relative_humidity+"</p>");
	}
	showBackButton();
}

function showCountryError()
{
	$("#countryInput").before("<p class=\"inputError\">Wrong country name</p>");
}

function showCityError()
{
	$("#cityInput").before("<p class=\"inputError\">Wrong city name</p>");
}

function clearErrors()
{
	$(".inputError").remove();
}

function showQueryError()
{
	$("#content").empty();
	$("#content").append("<p class=\"inputError\">Can't create your request</p>")
	showBackButton();
}

function showBackButton()
{
	$("#content").append("<div class=\"button\" id=\"backButton\"><span>Back</span></div>");
    var backButton = document.getElementById('backButton');
    
    backButton.addEventListener('touchstart', function(){
  		$("#backButton").toggleClass("active");
  	}, false);
    backButton.addEventListener('touchend', function(){
    	$("#backButton").toggleClass("active");
    	showWelcomeView();
  	}, false);
}

function showLoader()
{
	$("#content").append("<div id=\"fountainG\">" +
			"<div id=\"fountainG_1\" class=\"fountainG\"></div>" +
			"<div id=\"fountainG_2\" class=\"fountainG\"></div>" +
			"<div id=\"fountainG_3\" class=\"fountainG\"></div>" +
			"<div id=\"fountainG_4\" class=\"fountainG\"></div>" +
			"<div id=\"fountainG_5\" class=\"fountainG\"></div>" +
			"</div>");
}

function showWelcomeView()
{
	$("#content").empty();
	$("#content").append("<p id=\"title\">Simple Weather</p>");
	$("#content").append("<p class=\"contentText\">Type country</p>");
	$("#content").append("<input id=\"countryInput\"></input>");
	$("#content").append("<p class=\"contentText\">Type city</p>");
	$("#content").append("<input id=\"cityInput\"></input>");
	
	$("#content").append("<div class=\"button\" id=\"searchButton\"><span>Search</span></div>");
    var searchButton = document.getElementById('searchButton');
    
    searchButton.addEventListener('touchstart', function(){
  		$("#searchButton").toggleClass("active");
  	}, false);
    searchButton.addEventListener('touchend', function(){
    	$("#searchButton").toggleClass("active");
    	getWeather($("#countryInput").val(), $("#cityInput").val());
  	}, false);
}