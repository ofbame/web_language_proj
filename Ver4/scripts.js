(function(){
	'use strict';

	//settings
	var app = {
		ajaxMaxTries: 3,
		ajaxTries: 0
	};

	window.addEventListener('load', function() {

  app.updateOnlineStatus = function(event) {
    var condition = navigator.onLine ? "online" : "offline";

    console.log("status changed to:" + condition);

    if (navigator.onLine) {
    	document.getElementById("offline-flag").textContent = "";
    }
    else {
    	document.getElementById("offline-flag").textContent = "Currently in Offline Mode";
    }
  }

  window.addEventListener('online',  app.updateOnlineStatus);
  window.addEventListener('offline', app.updateOnlineStatus);

});

document.addEventListener('DOMContentLoaded', function() {

	var jsonAntimageSoundBoard;
	var jsonStormspiritSoundBoard;
	var jsonCurrentSoundboard;

	/* *** Theme Change Functions *** */
	var changeToLightTheme = function() {
		var body = document.querySelector("body");
		var header = document.querySelector("header");
		var footer = document.querySelector("footer");
		var main = document.querySelector("main");

		body.style.backgroundColor = "white";
		body.style.color = "black";
		header.style.backgroundColor = "#EEEEEE";
		footer.style.backgroundColor = "#EEEEEE";
		main.style.backgroundColor = "white";
	}

	var changeToDarkTheme = function() {
		var body = document.querySelector("body");
		var header = document.querySelector("header");
		var footer = document.querySelector("footer");
		var main = document.querySelector("main");
		var p = document.querySelector("p");
		var h4 = document.querySelector("h4");

		body.style.backgroundColor = "black";
		body.style.color = "white";
		header.style.backgroundColor = "#444444";
		footer.style.backgroundColor = "#444444";
		main.style.backgroundColor = "#222222";
	}

	/* *** JSON *** */
	
	var xhr = new XMLHttpRequest();
    if (typeof xhr.overrideMimeType === "function") { 
		xhr.overrideMimeType("application/json");  
	}else {
		// AJAX May not work in certain browsers where strict CORS policies exist!
		console.log("Ajax not working!");
	}

	var url = "sounds.json";

	xhr.onreadystatechange = function() {
	    if (this.readyState == 4){
	     	if(this.status == 200) { //valid response
		    	var jsonResponse;

		    	// Check JSON is well-formed (via parse function)
		    	try { 
		        	 jsonResponse = JSON.parse(this.responseText);
		        }
		        catch(e) {
		        	console.log("There was an error parsing the JSON file: " + e);
		        }

		        // Save the JSON boards into variables
		        jsonAntimageSoundBoard = jsonResponse.boards[0];
		        jsonStormspiritSoundBoard = jsonResponse.boards[1];
		        jsonCurrentSoundboard = jsonAntimageSoundBoard;

		        app.generateSoundboard(jsonCurrentSoundboard);
		        //Automatically switch to compact view for mobile
				if(window.matchMedia( "(max-width: 768px)").matches) {
					console.log("Switching to mobile view");
					app.setToCompact();
				}
			}else if(this.status == 404) { // file not found
				alert("Error! "+url+" could not be found!");
			}else if(this.status == 500) { //internal server error
				alert("Error! Response returned with Internal Server Error!");
			}else { // all else
				alert("Error! Response returned with " + this.status + ' ' + this.statusText);
			}
	    }
	};

	if ("withCredentials" in xhr) {

    // Check if the XMLHttpRequest object has a "withCredentials" property.
    // "withCredentials" only exists on XMLHTTPRequest2 objects.
    	xhr.open("GET", url, true);

  	} else if (typeof XDomainRequest != "undefined") {

    // XDomainRequest only exists in IE, and is IE's way of making CORS requests.
    	xhr = new XDomainRequest();
    	xhr.open(method, url);

  	} else {
    	// CORS is not supported by the browser.
    	// BUT TRY ANYWAY
    	xhr.open("GET", url, true);
    	alert("CORS is not supported for AJAX!");
  	}
	
	xhr.send();
	var xmlHttpTimeout = setTimeout(app.ajaxTimeout,3000);
	
	app.ajaxTimeout = function(){
		if( app.ajaxTries != app.ajaxMaxTries) {
   			xhr.abort();
   			alert("Request has timed out! Trying again");
   			app.ajaxTries++;
   			xhr.open("GET",url,true);
   			xhr.send();
   			var xmlHttpTimeout = setTimeout(app.ajaxTimeout,3000);
   		}else {
   			xhr.abort();
   			alert("Request cannot be made! Max tries attempted!")
   		}
	}

	/* ***Button Event Listeners*** */

	//Changes page to 'light' theme
	document.getElementById("light-theme").onclick = function() {
		changeToLightTheme();
	}

	//Changes page to 'dark' theme
	document.getElementById("dark-theme").onclick = function() {
		changeToDarkTheme();
	}

	//Generates the 'Anti Mage' set of sounds
	document.getElementById("antimage-sounds").onclick = function() {
		jsonCurrentSoundboard = jsonAntimageSoundBoard;
		app.generateSoundboard(jsonCurrentSoundboard);
	}

	//Generates the 'Storm Spirit' set of sounds
	document.getElementById("stormspirit-sounds").onclick = function() {
		jsonCurrentSoundboard = jsonStormspiritSoundBoard;
		app.generateSoundboard(jsonCurrentSoundboard);
	}

	//Sets the content to use the 'Rich' content style
	document.getElementById("rich-form").onclick = function() {
		var tiles = document.getElementsByClassName("sound-box");
		for (var i = 0; i < tiles.length; i++) {
			tiles[i].setAttribute("class", "sound-box rich col-lg-4 col-sm-12");
		}
	}

	//Sets the content to use the 'Compact' content style
	document.getElementById("compact-form").onclick = function() {
		app.setToCompact();
	}

}, false);

/* Takes in a soundboard array from the JSON and populates the page with sound tiles
	using the HTML template tag.
	- board: JSON object
 */
app.generateSoundboard = function (board) {

	//If the supplied board is undefined, let's return.
	if (typeof board === "undefined") {
		console.log("Board not found. JSON likely malformed.");
		return;
	}

	//Clear soundboard before generating content
	var container = document.querySelector(".container-fluid");
	while(container.firstChild){
    	container.removeChild(container.firstChild);
	}

	//Change heading to title of soundboard
	document.getElementById("soundboard-title").textContent = board.boardTitle;

	//Change overlay color according to soundboard
	document.getElementById("sound-overlay").style.backgroundColor = board.themeColor;

	//Clear progress bar
	app.clearProgressBar();

	//Generate Sound Tiles
	if ('content' in document.createElement("template")) {
		var numRows = 1;
		var numCols = 12;

		//Generates numRows of numCols of soundboard tiles
		var i, j;
		for (i = 0; i < numRows; i++) {
			//Generate row
			var rowDiv = document.createElement("div");
			rowDiv.setAttribute("class", "row");
			container.appendChild(rowDiv);

			for (j = 0; j < numCols; j++) {
				var num = (i * numCols) + j;
				//Generate columns
				//If the object can't be found, don't try to generate a tile for it.
				if (!(typeof board.sounds[num] === "undefined")) {
					rowDiv.appendChild(app.generateSoundtile(board.sounds[num].tileName, 
						board.sounds[num].soundFile, board.sounds[num].imageFile, num));

					//set background css
					var tileID = "tile-" + num + "";
					var soundID = "sound-" + num + "";
					var tile = document.getElementById(tileID);
					tile.style.backgroundColor = board.themeColor;
					tile.style.backgroundImage = "url('" + board.sounds[num].imageFile + "')";
				}
			}
		}

		//Audio Controls
		var soundTiles = document.getElementsByClassName("sound-box");
		for (var i = 0; i < soundTiles.length; i++) {

			//Set the sounds to play and pause when the div is clicked
			soundTiles[i].addEventListener('click', function(e) {
				//Fade effect on click
				app.fadeInElement(e.target);

				//Play audio file
				var soundToPlay = e.target.getElementsByTagName("audio")[0];
				if (!(typeof soundToPlay === "undefined")) {
					if (!soundToPlay.paused) {
						soundToPlay.pause();
					}
					else {
						app.playOnlyOne(soundToPlay);
					}
				}
			});
		}
	}
}

/* Generates an individual sound tile, returning it as an object */
app.generateSoundtile = function(name, soundfile, imagefile, id, color) {

	//Sound tile id
	var soundID = "sound-" + id + "";
	var tileID = "tile-" + id + "";

	//Access the template
	var tileTemplate = document.getElementById("soundtile-template");

	//Clone the template so we can edit it
	var clone = tileTemplate.content.cloneNode(true);

	//Edit the content of the template
	clone.querySelector(".sound-box").setAttribute("id", tileID);

	var tileText = clone.querySelector(".sound-title");

	var audioFile = clone.querySelector("audio");

	tileText.textContent = name;

	audioFile.src = soundfile;
	audioFile.setAttribute("id", soundID);

	/* Progress Bar logic */
	audioFile.addEventListener('playing', function() {
		document.getElementById("sound-playing").textContent = "Currently Playing: " + name;

		var timer = setInterval(function () {
			var progressWidth = audioFile.currentTime / audioFile.duration;
	        if (progressWidth >= 1){
	        	app.fadeOutElement(document.getElementById("progress-bar"));
	            clearInterval(timer);
	        }
	        document.getElementById("progress-bar").style.width = 
	            "" + (110 * progressWidth) + "%"
	    }, 50);
	});

	/* Update progress bar when sound ends */
	audioFile.addEventListener('ended', function() {
		document.getElementById("sound-playing").textContent = "Currently Playing: ";
	});

	return clone;
}

/* Fades out an element: fadein is a flag, true for fadein, false for fadeout */
app.fadeOutElement = function(element) {

    var op = 1;  // initial opacity
    var timer = setInterval(function () {
        if (op <= 0.1){
            clearInterval(timer);
            element.style.opacity = 1;
            element.style.display = "none";
        }
        element.style.opacity = op;
        element.style.filter = 'alpha(opacity=' + op * 100 + ")";
        op -= op * 0.1;
    }, 15);
}

app.fadeInElement = function(element) {

    var op = .1;  // initial opacity
    var timer = setInterval(function () {
        if (op >= 0.9){
            clearInterval(timer);
            element.style.opacity = 1;
        }
        element.style.opacity = op;
        element.style.filter = 'alpha(opacity=' + op * 100 + ")";
        op += op * 0.1
    }, 15);
}

/* Ensures only a single audio file plays at a time */
app.playOnlyOne = function(audio) {
	if (typeof audio === "undefined")
		return;

	var audioTags = document.getElementsByTagName("audio");
	var i;
	var shouldPlay = true;
	for (i = 0; i < audioTags.length; i++) {
		if (!audioTags[i].paused) {
			shouldPlay = false;
		}
	}

	if (shouldPlay) {
		app.clearProgressBar();
		audio.play();
	}
}

app.setToCompact = function() {
	var tiles = document.getElementsByClassName("sound-box");
	for (var i = 0; i < tiles.length; i++) {
		tiles[i].setAttribute("class", "sound-box compact col-lg-4 col-sm-12");
	}
}

app.clearProgressBar = function() {
	var progressBar = document.getElementById("progress-bar");
	progressBar.style.width = "0px";
	progressBar.style.opacity = 1;
	progressBar.style.display = "table";
	document.getElementById("sound-playing").textContent = "Currently Playing:";
}

})();