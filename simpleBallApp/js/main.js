var canvas;
var context;
var levelData;
var drawScale = 1;
var physicsWorld;
var ballBody;

window.onload = function () {
        
    // add eventListener for tizenhwkey
    document.addEventListener('tizenhwkey', function(e) {
        if(e.keyName == "back")
            tizen.application.getCurrentApplication().exit();
    });
    
    var myButton = document.getElementById('cssStartButton');
    
    // add eventListener for touchstart
  	myButton.addEventListener('touchstart', function(){this.id = "cssStartButtonHover";}, false);
  	// add eventListener for touchend
  	myButton.addEventListener('touchend', function(){$("#cssStartButtonHover").slideUp("fast", startApp); }, false);
    
  	};


function startApp(event)
{
	// remove button
	$("#pageContent").remove("#cssStartButtonHover");
	
	// add coordinates paragraph
	$("<p id='coordinates'>XY</p>").appendTo("#pageContent");
	
	// add canvas and set size
	$("<canvas id='levelView'</canvas>").appendTo("#pageContent");
	canvas = document.getElementById("levelView");
	canvas.width = $('#page').width();
	canvas.height = $('#page').innerHeight() - $("#coordinates").outerHeight();
	context = canvas.getContext("2d");
	
	$.getJSON("level.json", loadLevel)
}

// load level from JSON data
function loadLevel(jsonData)
{
	levelData = jsonData;	
	
	// calculate canvas scale
	drawScale = Math.min(canvas.width/jsonData.width, canvas.height/jsonData.height);
	
	// center canvas context
	context.translate(canvas.width/2 - drawScale*jsonData.width/2, canvas.height/2 - drawScale*jsonData.height/2);
	context.scale(drawScale, drawScale);	
	
	// draw rectangles
	jsonData.rect.forEach(drawRectangleFromJSON);
	
	// draw ball circle
	context.beginPath();
	context.arc(jsonData.ballX,jsonData.ballY,jsonData.ballRadius,0,2*Math.PI);
	context.fillStyle = 'green';
	context.fill();
	
	initializePhysics();
	
	// add eventListener for deviceorientation (rotation change)
	window.addEventListener('deviceorientation', function(event) {
		var   b2Vec2 = Box2D.Common.Math.b2Vec2;
		var alpha = event.alpha;
		var beta = event.beta;
		var gamma = event.gamma;
		  
		/*var coords = document.getElementById("coordinates");
			
		coords.innerHTML = 'Rotation: '
		    + '[ x: '+ Math.round(alpha) + " ]"
		    + '[ y: '+ Math.round(beta) + " ]"
		    + '[ z: '+ Math.round(gamma) + ' ]' + Math.random();*/
		}, true);
	
	// add eventListener for devicemotion
    window.addEventListener("devicemotion", logDeviceMotion, true);
}

// device motion function
function logDeviceMotion(e)
{
	var coords = document.getElementById("coordinates");
	var   b2Vec2 = Box2D.Common.Math.b2Vec2;
	
	coords.innerHTML = 'Acceleration: '
        + '[ x: '+ Math.round(e.acceleration.x) + " ]"
        + '[ y: '+ Math.round(e.acceleration.y) + " ]"
        + '[ z: '+ Math.round(e.acceleration.z) + ' ]';
	
	coords.innerHTML = coords.innerHTML + 'Gravity: '
        + '[ x: ' + Math.round(e.accelerationIncludingGravity.x) + " ]"
        + '[ y: ' + Math.round(e.accelerationIncludingGravity.y) + " ]"
        + '[ z: ' + Math.round(e.accelerationIncludingGravity.z) + ' ]';
	
	// change physics gravity according to world gravity
	physicsWorld.SetGravity(new b2Vec2(Math.round(e.accelerationIncludingGravity.y*50), Math.round(e.accelerationIncludingGravity.x*50)));
}

// draw rectangle from JSON data
function drawRectangleFromJSON(rect)
{
	context.fillStyle = 'white';
	context.fillRect(rect.x, rect.y, rect.width, rect.height);
}

// initialize physics world and bodies
function initializePhysics()
{
	var   b2Vec2 = Box2D.Common.Math.b2Vec2
 	,	b2BodyDef = Box2D.Dynamics.b2BodyDef
 	,	b2Body = Box2D.Dynamics.b2Body
 	,	b2FixtureDef = Box2D.Dynamics.b2FixtureDef
 	,	b2Fixture = Box2D.Dynamics.b2Fixture
 	,	b2World = Box2D.Dynamics.b2World
 	,	b2MassData = Box2D.Collision.Shapes.b2MassData
 	,	b2PolygonShape = Box2D.Collision.Shapes.b2PolygonShape
 	,	b2CircleShape = Box2D.Collision.Shapes.b2CircleShape
 	,	b2EdgeShape = Box2D.Collision.Shapes.b2EdgeShape
 	,   b2DebugDraw = Box2D.Dynamics.b2DebugDraw
    ;
	
	physicsWorld = new b2World(
            new b2Vec2(0, 0)    //gravity
         ,  true                 //allow sleep
      );
	
	var groundBodyDef = new b2BodyDef;
	
	groundBodyDef.position.Set(0,0); 
	groundBodyDef.type = b2Body.b2_staticBody;
	
	var fixDef = new b2FixtureDef;
    fixDef.density = 1.0;
    fixDef.friction = 0.5;
    fixDef.restitution = 0.2;
	
    fixDef.shape = new b2PolygonShape;
    
    // bottom
    b2Vec2(levelData.width,0)
    fixDef.shape.SetAsEdge(new b2Vec2(0,0), new b2Vec2(levelData.width,0));
    
    physicsWorld.CreateBody(groundBodyDef).CreateFixture(fixDef);
    
    // top
    fixDef.shape.SetAsEdge(new b2Vec2(0,levelData.height), new b2Vec2(levelData.width,levelData.height));
    physicsWorld.CreateBody(groundBodyDef).CreateFixture(fixDef);
    
    // left
    fixDef.shape.SetAsEdge(new b2Vec2(0,levelData.height), new b2Vec2(0,0));
    physicsWorld.CreateBody(groundBodyDef).CreateFixture(fixDef);
    
    // right
    fixDef.shape.SetAsEdge(new b2Vec2(levelData.width,levelData.height), new b2Vec2(levelData.width,0));
    physicsWorld.CreateBody(groundBodyDef).CreateFixture(fixDef);
    
    var bodyDef = new b2BodyDef;
    
    // create body for each rectangle
    levelData.rect.forEach(function(rect){
    	fixDef.shape = new b2PolygonShape;
    	// rectangles need half of real size
        fixDef.shape.SetAsBox(rect.width/2, rect.height/2);
        // position with correction
        bodyDef.position.Set(rect.x + rect.width/2, rect.y + rect.height/2);
        physicsWorld.CreateBody(bodyDef).CreateFixture(fixDef);
    });    
    
    // create body for ball
    bodyDef.type = b2Body.b2_dynamicBody;
    fixDef.shape = new b2CircleShape(levelData.ballRadius);
    bodyDef.position.x = levelData.ballX;
    bodyDef.position.y = levelData.ballY;
    
    ballBody = physicsWorld.CreateBody(bodyDef);
    ballBody.CreateFixture(fixDef);
    
    // settings for debug draw
    var debugDraw = new b2DebugDraw();
	debugDraw.SetSprite(context);
	debugDraw.SetDrawScale(1.0);
	debugDraw.SetFillAlpha(0.5);
	debugDraw.SetLineThickness(1.0);
	debugDraw.SetFlags(b2DebugDraw.e_shapeBit | b2DebugDraw.e_jointBit);
	physicsWorld.SetDebugDraw(debugDraw);
    

    window.setInterval(update, 1000 / 60);
}

// update world
function update() { 
    physicsWorld.Step(1 / 60, 10, 10);
    physicsWorld.ClearForces();
    viewUpdate();
 };
 
 // update view
 function viewUpdate(){
	 var   b2Vec2 = Box2D.Common.Math.b2Vec2;
	    context.clearRect(0, 0, canvas.width/drawScale, canvas.height/drawScale);
	    levelData.rect.forEach(drawRectangleFromJSON);
	    
	    var ballPosition = ballBody.GetPosition();
	    
		context.beginPath();
		context.arc(ballPosition.x,ballPosition.y,levelData.ballRadius,0,2*Math.PI);
		context.fillStyle = 'green';
		context.fill();	
 }
 
